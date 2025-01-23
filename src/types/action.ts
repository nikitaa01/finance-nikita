import type { ActionState } from "./action-state";

export type Action<Data, Error> = (
  state: ActionState<Data, Error>,
  formData: FormData,
) => Promise<ActionState<Data, Error>>;
