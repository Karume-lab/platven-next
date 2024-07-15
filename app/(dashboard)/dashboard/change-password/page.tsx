import BreadCrumb from "@/components/breadcrumb";
import ChangePasswordForm from "@/components/forms/auth/ChangePasswordForm";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getSessionUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

const breadcrumbItems = [
  { title: "Change Password", link: "/dashboard/change-password" },
];

const ChangePassword = async () => {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="w-full flex justify-center">
          <div className="w-full lg:max-w-lg flex flex-col space-y-10 shadow-md p-10 my-10">
            <Heading title="Change Password" description="" />
            <Separator />
            {/* <CreateProfileOne categories={[]} initialData={null} /> */}
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ChangePassword;
