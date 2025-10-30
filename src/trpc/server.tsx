import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import {
  type DehydratedState,
  HydrationBoundary,
  type Query,
} from "@tanstack/react-query";
import {
  type TRPCQueryOptions,
  createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

export const getQueryClient = cache(createQueryClient);

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const api = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});

const noop = () => {};
type TransformerFn = (data: any) => any;

type DehydratedQuery = DehydratedState["queries"][number];
function dehydrateQuery(
  query: Query,
  serializeData: TransformerFn,
  shouldRedactErrors: (error: unknown) => boolean,
): DehydratedQuery {
  const promise = query.promise?.then(serializeData).catch((error) => {
    if (!shouldRedactErrors(error)) {
      // Reject original error if it should not be redacted
      return Promise.reject(error);
    }
    // If not in production, log original error before rejecting redacted error
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `A query that was dehydrated as pending ended up rejecting. [${query.queryHash}]: ${error}; The error will be redacted in production builds`,
      );
    }
    return Promise.reject(new Error("redacted"));
  });

  // Avoid unhandled promise rejections
  // We need the promise we dehydrate to reject to get the correct result into
  // the query cache, but we also want to avoid unhandled promise rejections
  // in whatever environment the prefetches are happening in.
  promise?.catch(noop);

  return {
    dehydratedAt: Date.now(),
    state: {
      ...query.state,
      ...(query.state.data !== undefined && {
        data: serializeData(query.state.data),
      }),
    },
    queryKey: query.queryKey,
    queryHash: query.queryHash,
    ...(query.state.status === "pending" && {
      promise,
    }),
    ...(query.meta && { meta: query.meta }),
  };
}

function defaultTransformerFn(data: any): any {
  return data;
}

function defaultShouldRedactErrors(_: unknown) {
  return true;
}

export async function HydrateClient<
  T extends ReturnType<TRPCQueryOptions<any>>,
>(props: { children: React.ReactNode; queryOptions: T | T[] }) {
  const queryClient = getQueryClient();
  const queryOptionsArray = Array.isArray(props.queryOptions)
    ? props.queryOptions
    : [props.queryOptions];
  await Promise.all(queryOptionsArray.map(prefetch));
  const queryCache = queryClient.getQueryCache();
  const queries = queryOptionsArray.map((queryOption) => {
    const query = queryCache.get(JSON.stringify(queryOption.queryKey));
    if (!query) {
      throw new Error("Query not found");
    }
    return query;
  });

  const serializeData =
    queryClient.getDefaultOptions().dehydrate?.serializeData ??
    defaultTransformerFn;

  const shouldRedactErrors =
    queryClient.getDefaultOptions().dehydrate?.shouldRedactErrors ??
    defaultShouldRedactErrors;

  return (
    <HydrationBoundary
      state={{
        mutations: [],
        queries: queries.map((query) =>
          dehydrateQuery(query, serializeData, shouldRedactErrors),
        ),
      }}
    >
      {props.children}
    </HydrationBoundary>
  );
}
export async function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    await queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    await queryClient.prefetchQuery(queryOptions);
  }
}
