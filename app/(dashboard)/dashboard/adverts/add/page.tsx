import BreadCrumb from "@/components/breadcrumb";
import AdvertForm from "@/components/forms/adverts/AdvertForm";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {};

const breadcrumbItems = [
  { title: "Adverts", link: "/dashboard/adverts" },
  { title: "Add", link: "/dashboard/adverts/add" },
];

const page = () => {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <AdvertForm />
      </div>
    </ScrollArea>
  );
};

export default page;
