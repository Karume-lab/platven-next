import { SessionContext } from "@/context";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const useSessionContext = () => {
  const session = useContext(SessionContext);
  const { replace } = useRouter();
  const signOut = async () => {
    await fetch("/api/auth/logout");
    session.setUser(undefined);
    replace("/sign-in");
  };
  return { ...session, signOut };
};

export default useSessionContext;
