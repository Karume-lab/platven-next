import { User } from "@prisma/client";
import { createContext } from "react";

export interface Session {
  user?: User;
  setUser: (user?: User) => void;
}

export const SessionContext = createContext<Session>({ setUser(user) {} });
export const SessionContextProvider = SessionContext.Provider;
export const SessionContextConsumer = SessionContext.Consumer;
