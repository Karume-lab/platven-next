import BreadCrumb from "@/components/breadcrumb";
import PropertyForm from "@/components/forms/properties/properties-form";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Properties", link: "/dashboard/properties" },
  { title: "Add", link: "/dashboard/properties/add" },
];
const AddProperty = () => {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <PropertyForm />
      </div>
    </ScrollArea>
  );
};

export default AddProperty;
