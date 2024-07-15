"use client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";

const Verifier = ({ token }: { token: string }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/auth/verify/${token}`);
        if (response.status === 200) {
          console.log(
            "Redirecting to: ",
            searchParams.get("callbackUrl") ?? "/",
          );
          const callBack = searchParams.get("callbackUrl");
          try {
            const decoded = callBack ? decodeURIComponent(callBack) : "/";
            router.replace(decoded);
          } catch (error) {
            router.replace("/");
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Opps!.Failure",
          description: "Vefification Failed, Please try again",
        });
        router.replace("/verify");
      }
    })();
  }, []);
  return (
    <div className="flex justify-center">
      <PuffLoader
        // color={color}
        loading={loading}
        // cssOverride={override}
        className="w-100 h-100"
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Verifier;
