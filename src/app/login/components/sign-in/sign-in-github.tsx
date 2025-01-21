"use client";
import { Button } from "@/components/ui/button";

import { Github } from "@/components/icons/github";
import { signInGithub } from "@/server/services/auth/sign-in/sign-in-github";

export const SignInGithub = () => {
  return (
    <Button onClick={signInGithub}>
      <Github /> Login with Github
    </Button>
  );
};
