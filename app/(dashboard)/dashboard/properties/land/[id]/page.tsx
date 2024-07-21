import BreadCrumb from "@/components/breadcrumb";
import LandForm from "@/components/forms/properties/LandForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import prisma from "@/prisma/client";
import { PropsWithPathParams } from "@/types";
import { FC } from "react";

const breadcrumbItems = [
    { title: "Properties", link: "/dashboard/properties" },
    { title: "Add", link: "/dashboard/properties/add" },
];

const LandUpdatePage: FC<PropsWithPathParams> = async ({
    params: { id },
}) => {
    const land = await prisma.land.findUnique({ where: { id }, include: { property: true }, });

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />
                <LandForm
                    land={
                        { ...land, price: Number(land?.property.price) as any } as any
                    }
                    property={land?.property}
                />
            </div>
        </ScrollArea>
    );
};

export default LandUpdatePage;
