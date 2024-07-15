"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Icons } from "./icons";
import { Button } from "./ui/button";

export default function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        signIn("google", { callbackUrl: callbackUrl ?? "/dashboard" })
      }
    >
      <Icons.twitter className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}
