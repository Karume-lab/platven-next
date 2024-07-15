"use client";
import { SessionContextProvider } from "@/context";
import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
export default function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const user: User = await response.json();
        setUser(user);
      }else {
        
      }
    })();
  }, []);

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionContextProvider value={{ user, setUser }}>
          {children}
        </SessionContextProvider>
      </ThemeProvider>
    </>
  );
}
