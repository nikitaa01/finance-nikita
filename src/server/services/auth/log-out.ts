import { authClient } from "@/server/auth-client";
import { redirect } from "next/navigation";

export const logOut = async () => {
  const { data, error } = await authClient.signOut();

  redirect("/login");
  return { data, error };
};
