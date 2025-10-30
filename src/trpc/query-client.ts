import {
  MutationCache,
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";
import SuperJSON from "superjson";

function handleUnauthorizedError(error: Error) {
  if (error instanceof TRPCError && error.code === "UNAUTHORIZED") {
    redirect("/login");
  }
  if (error instanceof TRPCClientError && error.message === "UNAUTHORIZED") {
    window.location.replace("/login");
  }
}

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: handleUnauthorizedError,
    }),
    mutationCache: new MutationCache({
      onError: handleUnauthorizedError,
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
        retry: false,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
