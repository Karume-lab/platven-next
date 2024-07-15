"use client";
import useSessionContext from "@/hooks/useSessionContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const AuthStateChecker = () => {
  const { user } = useSessionContext();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (user) {
      if (!user.accountVerified) {
        replace("/verify");
      } else {
        console.log("Redirecting to: ", searchParams.get("callbackUrl") ?? "/");
        const callBack = searchParams.get("callbackUrl");
        try {
          const decoded = callBack ? decodeURIComponent(callBack) : "/";
          replace(decoded);
        } catch (error) {
          replace("/");
        }
      }
    }
  }, [user]);
  return <div />;
};

export default AuthStateChecker;
