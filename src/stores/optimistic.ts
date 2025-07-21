import type { StateCreator, StoreApi, StoreMutatorIdentifier } from "zustand";

interface OptimisticActionsConfig<TState, TItem, TItemId> {
  getItems: (state: TState) => TItem[];
  setItems: (args: { state: TState; items: TItem[] }) => Partial<TState>;
  getId: (item: TItem) => TItemId;
}

interface OptimisticActions<TItem, TItemId> {
  create: (item: TItem) => () => void;
  delete: (id: TItemId) => () => void;
  update: (id: TItemId, updatedItem: TItem) => () => void;
}

interface OptimisticApiExtension<TState extends object> {
  createOptimisticActions: <TItem, TItemId>(
    config: OptimisticActionsConfig<TState, TItem, TItemId>,
  ) => OptimisticActions<TItem, TItemId>;
}

type Optimistic = <
  TState extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  fn: (
    set: StoreApi<TState>["setState"],
    get: StoreApi<TState>["getState"],
    api: StoreApi<TState> & OptimisticApiExtension<TState>,
  ) => TState,
) => StateCreator<TState, Mps, Mcs, TState>;

export const optimistic: Optimistic = (fn) => (set, get, api) => {
  const createOptimisticActions = <TItem, TItemId>(
    config: OptimisticActionsConfig<ReturnType<typeof fn>, TItem, TItemId>,
  ): OptimisticActions<TItem, TItemId> => {
    const { getItems, setItems, getId } = config;

    return {
      create: (item: TItem) => {
        set((state) => setItems({ state, items: [...getItems(state), item] }));

        return () => {
          set((state) =>
            setItems({
              state,
              items: getItems(state).filter((i) => getId(i) !== getId(item)),
            }),
          );
        };
      },
      delete: (id: TItemId) => {
        const itemsBeforeDelete = getItems(get());
        const itemToDelete = itemsBeforeDelete.find((i) => getId(i) === id);

        set((state) =>
          setItems({
            state,
            items: getItems(state).filter((i) => getId(i) !== id),
          }),
        );

        return () => {
          if (!itemToDelete) return;

          const currentItems = getItems(get());
          if (!currentItems.some((i) => getId(i) === getId(itemToDelete))) {
            const reInsertedItems = [...currentItems];
            const originalIndex = itemsBeforeDelete.findIndex(
              (i) => getId(i) === getId(itemToDelete),
            );
            if (originalIndex !== -1) {
              reInsertedItems.splice(originalIndex, 0, itemToDelete);
              set((state) => setItems({ state, items: reInsertedItems }));
            } else {
              set((state) =>
                setItems({ state, items: [...currentItems, itemToDelete] }),
              );
            }
          }
        };
      },
      update: (id: TItemId, updatedItem: TItem) => {
        const itemsBeforeUpdate = getItems(get());
        const originalItem = itemsBeforeUpdate.find((i) => getId(i) === id);

        set((state) =>
          setItems({
            state,
            items: getItems(state).map((i) =>
              getId(i) === id ? updatedItem : i,
            ),
          }),
        );

        return () => {
          if (!originalItem) return;
          set((state) =>
            setItems({
              state,
              items: getItems(state).map((i) =>
                getId(i) === id ? originalItem : i,
              ),
            }),
          );
        };
      },
    };
  };

  const extendedApi = {
    ...api,
    createOptimisticActions,
  } as StoreApi<ReturnType<typeof fn>> &
    OptimisticApiExtension<ReturnType<typeof fn>>;

  return fn(set, get, extendedApi);
};
