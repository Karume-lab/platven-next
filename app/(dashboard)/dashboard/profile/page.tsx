import BreadCrumb from "@/components/breadcrumb";
import ProfileForm from "@/components/forms/profile/profle-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSessionUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

const breadcrumbItems = [{ title: "Profile", link: "/dashboard/profile" }];
export default async function page() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        {/* <CreateProfileOne categories={[]} initialData={null} /> */}
        <ProfileForm user={user} />
      </div>
    </ScrollArea>
  );
}
