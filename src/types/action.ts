export type ActionState<Data, Errors> =
  | {
      status: "not-started";
    }
  | {
      status: "success";
      data: Data;
    }
  | {
      status: "error";
      errors: Errors;
    };

export type Action<Data, Error> = (
  state: ActionState<Data, Error>,
  formData: FormData,
) => Promise<ActionState<Data, Error>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionStateByAction<T extends Action<any, any>> = Awaited<
  ReturnType<T>
>;
