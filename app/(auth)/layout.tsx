import AuthStateChecker from "@/components/forms/auth/AuthStateChecker";
import Logo from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import bg from "@/public/title-platven.jpg";
import Image from "next/image";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";

const AuthLayout: FC<PropsWithChildren> = async ({ children }) => {
  return (
    <>
      <AuthStateChecker />
      <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-auto ">
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 hidden top-4 md:right-8 md:top-8",
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0">
            <Image
              src={bg}
              alt=""
              className="w-full h-full object-cover bg-black absolute"
            />
            <div className="w-full h-full bg-black absolute opacity-50" />
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Logo />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Finding property of your taste and standards has never
                been this easy.&rdquo;
              </p>
              <footer className="text-sm">By VSTech LTD</footer>
            </blockquote>
          </div>
        </div>
        <div className="p-4 lg:p-8 h-full flex items-center ">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:max-w-[400px]">
            {children}
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
