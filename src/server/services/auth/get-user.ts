import { getSession } from "./get-session";

export const getUser = async () => {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("User not found");
  }

  return session.user;
};
