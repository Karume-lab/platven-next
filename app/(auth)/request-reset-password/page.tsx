import RequestResetPasswordForm from "@/components/forms/auth/RequestResetPasswordForm";
import Link from "next/link";

const RequestResetPasswod = () => {
  return (
    <div>
      <div className="flex flex-col space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address where you will receive reset password link
        </p>
      </div>
      <RequestResetPasswordForm />
      <div className="flex pt-4 space-x-2 ">
        <Link href="/sign-in" className="underline opacity-50">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default RequestResetPasswod;
