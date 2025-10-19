"use client";

import { authClient } from "@/auth-client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { GithubIcon } from "./icons/github-icon";
import { Button } from "./ui/button";

export const GithubLoginButton = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  return (
    <Button onClick={handleLogin} disabled={loading}>
      {loading ? <Loader2 className="animate-spin" /> : <GithubIcon />} Login
      with GitHub
    </Button>
  );
};
