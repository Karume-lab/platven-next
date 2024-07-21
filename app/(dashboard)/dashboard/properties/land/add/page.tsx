import BreadCrumb from "@/components/breadcrumb";
import LandForm from "@/components/forms/properties/LandForm";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
    { title: "Properties", link: "/dashboard/properties" },
    { title: "Add", link: "/dashboard/properties/add" },
];
const AddLand = () => {
    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />
                <LandForm />
            </div>
        </ScrollArea>
    );
};

export default AddLand;
