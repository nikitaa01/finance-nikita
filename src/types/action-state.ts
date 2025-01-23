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
