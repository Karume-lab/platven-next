import RegisterForm from "@/components/forms/auth/RegisterForm";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Plativen credential sign up screen",
};

const SignUpPage = () => {
  return (
    <div>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <RegisterForm />
      <div className="flex pt-4 space-x-2">
        <p>Already have an account?</p>
        <Link href="/sign-in" className="underline opacity-50">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
