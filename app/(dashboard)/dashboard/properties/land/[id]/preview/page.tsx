import BreadCrumb from "@/components/breadcrumb";
import ImageDisplay from "@/components/ImageDisplay";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getSessionUser } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { PropsWithPathParams } from "@/types";
import clsx from "clsx";
import { FC } from "react";
import PropertyPriviewAction from "./actions";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const breadcrumbItems = [
  { title: "Properties", link: "/dashboard/properties" },
  { title: "Preview", link: "" },
];
const PropertyPreview: FC<PropsWithPathParams> = async ({ params: { id } }) => {
  const user = await getSessionUser();
  const property = await prisma.property.findUnique({
    where: { id },
    include: { type: true, user: true },
  });
  if (!property) return <div>Not found!</div>;
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 lg:w-[50%]">
        <BreadCrumb items={breadcrumbItems} />
        <Heading title={property.title} description="Preview property" />
        <Separator />
        <div className="w-ful h-[50vh]">
          <ImageDisplay images={property.images} />
        </div>
        <div className="shadow-md p-4 space-y-3 shadow-slate-400 dark:shadow-slate-700">
          <h1 className="text-2xl">Features</h1>
          <MarkdownRenderer markdownContent={property.features ?? ""} />
          {/* <p className="opacity-50">{property.features}</p> */}
        </div>
        <div className="shadow-md p-4 space-y-3  shadow-slate-400 dark:shadow-slate-700">
          <h1 className="text-2xl">Details</h1>
          <div className="grid grid-cols-2">
            <span>County</span>
            <span>{property.county}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Sub county</span>
            <span>{property.subCounty}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Price</span>
            <span>{Number(property.price)}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Size/Capacity</span>
            <span>{property.size}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Land mark</span>
            <span>{property.landMark}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Nature of road access</span>
            <span>{property.roadAccessNature}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Status</span>
            <span>{property.status}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Type</span>
            <span>{property.type.title}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Approved status</span>
            <span>
              <Badge
                className={clsx({
                  "bg-destructive": !property.isActive,
                  "bg-green-800": property.isActive,
                })}
              >
                {property.isActive
                  ? "Approved"
                  : property.rejectionReason
                  ? "Rejected"
                  : "Pending"}
              </Badge>
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span>IsListed</span>
            <span>
              {property.listed ? (
                <Badge>Listed</Badge>
              ) : (
                <Badge>Unlisted</Badge>
              )}
            </span>
          </div>
        </div>
        {!property.isActive && property.rejectionReason && (
          <div className="shadow-md p-4 space-y-3 shadow-slate-400 dark:shadow-slate-700">
            <h1 className="text-2xl">Rejection Reason</h1>
            <p className="opacity-50">{property.rejectionReason}</p>
          </div>
        )}
        <div className="shadow-md p-4 space-y-3  shadow-slate-400 dark:shadow-slate-700">
          <h1 className="text-2xl">Owner Details</h1>
          <div className="grid grid-cols-2">
            <span>Name</span>
            <span>{property.user.name}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Email</span>
            <span>{property.user.email}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Phone number</span>
            <span>{property.user.phoneNumber}</span>
          </div>
          <div className="grid grid-cols-2">
            <span>Address</span>
            <span>{property.user.address}</span>
          </div>

          <div className="grid grid-cols-2">
            <span>IsActive</span>
            <span>
              {property.user.isActive ? (
                <Badge>Active</Badge>
              ) : (
                <Badge>Inactive</Badge>
              )}
            </span>
          </div>
        </div>
        {(user?.isStaff || user?.isSuperUser) && (
          <PropertyPriviewAction
            user={user}
            property={JSON.parse(JSON.stringify(property))}
          />
        )}
      </div>
    </ScrollArea>
  );
};

export default PropertyPreview;
