import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { lazy } from "@trpc/server";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: lazy(() => import("./routers/user")),
  expense: lazy(() => import("./routers/expense")),
  expenseCategory: lazy(() => import("./routers/expense-category")),
  expenseSubcategory: lazy(() => import("./routers/expense-subcategory")),
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
