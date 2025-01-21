import { authClient } from "@/server/auth-client";

export const signInGithub = async () => {
  const { data, error } = await authClient.signIn.social({
    provider: "github",
    callbackURL: "/",
  });

  return { data, error };
};
