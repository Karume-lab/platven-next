"use client";
import { useToast } from "@/components/ui/use-toast";
import { objectToFormData } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Property } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { appartmentFormSchema, homeFormSchema, landFormSchema } from "./schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import "easymde/dist/easymde.min.css";
import BasePropertyForm from "./base-property-form";

type Props = {
  property?: Property;
};

const formSchema = landFormSchema;
type UserFormValue = z.infer<typeof formSchema>;


const landFormFields = [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "e.g Plativen apartments",
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    placeholder: "e.g 4000",
  },
  {
    name: "size",
    label: "Size (square feet size)",
    type: "text",
    placeholder: "e.g 4000",
  },
  {
    name: "landMark",
    label: "Landmark",
    type: "text",
    placeholder: "Enter popular landmark",
  },
  {
    name: "roadAccessNature",
    label: "Nature of road access",
    type: "select",
    options: [
      { id: "1", name: "Highway" },
      { id: "2", name: "Tarmac" },
      { id: "3", name: "Murram" },
    ],
  },
  {
    name: "listed",
    label: "Publish Listing",
    type: "checkbox",
    description: "Make it visible and accessible by the public",
  },
  {
    name: "features",
    label: "Features",
    type: "textarea",
    placeholder: "Enter Feature ...",
  },
];

const appartmentFormFields = [
  {
    name: "noOfBedRooms",
    label: "Number of Bedrooms",
    type: "number",
    placeholder: "Enter number of bedrooms",
    min: 1,
    required: true
  },
  {
    name: "size",
    label: "Size",
    type: "text",
    placeholder: "Enter size (optional)"
  },
  {
    name: "rentPerMonth",
    label: "Monthly Rent",
    type: "number",
    placeholder: "Enter monthly rent",
    min: 0,
    required: true
  },
  {
    name: "depositAmount",
    label: "Deposit Amount",
    type: "number",
    placeholder: "Enter deposit amount",
    min: 0,
    required: true
  },
  {
    name: "availableFrom",
    label: "Available From",
    type: "date",
    min: new Date().toISOString().split('T')[0],
    required: true
  },
  {
    name: "furnished",
    label: "Furnished",
    type: "checkbox"
  },
  {
    name: "utilities",
    label: "Utilities Included",
    type: "multiselect",
    options: [
      { id: "1", name: "Water" },
      { id: "2", name: "Electricity" },
      { id: "3", name: "Internet" },
      { id: "4", name: "Gas" },
      { id: "5", name: "Heating" }
    ]
  },
  {
    name: "amenities",
    label: "Amenities",
    type: "multiselect",
    options: [
      { id: "1", name: "Parking" },
      { id: "2", name: 'Gym' },
      { id: "3", name: 'Swimming Pool' },
      { id: "4", name: 'Security' },
      { id: "5", name: 'Elevator' }
    ]
  },
  {
    name: "maxOccupants",
    label: "Maximum Occupants",
    type: "number",
    placeholder: "Enter maximum number of occupants",
    min: 1
  },
  {
    name: "features",
    label: "Features",
    type: "textarea",
    placeholder: "Enter Feature ...",
  },
];

const homeFormFields = [
  {
    name: "noOfBedRooms",
    label: "Number of Bedrooms",
    type: "number",
    placeholder: "Enter number of bedrooms",
    min: 1,
    required: true
  },
  {
    name: "noOfBathrooms",
    label: "Number of Bathrooms",
    type: "number",
    placeholder: "Enter number of bathrooms",
    min: 1,
    required: true
  },
  {
    name: "size",
    label: "Size",
    type: "text",
    placeholder: "Enter size",
    required: true
  },
  {
    name: "plotSize",
    label: "Plot Size",
    type: "text",
    placeholder: "Enter plot size"
  },
  {
    name: "yearBuilt",
    label: "Year Built",
    type: "number",
    placeholder: "Enter year built",
    min: 1800,
    max: new Date().getFullYear(),
    required: true
  },
  {
    name: "HomeType",
    label: "Home Type",
    type: "select",
    options: [
      { id: '1', name: 'Single Family' },
      { id: '2', name: 'Bungalow' },
      { id: '3', name: 'Condo' },
      { id: '4', name: 'Multi-Family' }
    ],
    required: true
  },
  {
    name: "parkingSpaces",
    label: "Parking Spaces",
    type: "number",
    placeholder: "Enter number of parking spaces",
    min: 0
  },
  {
    name: "basement",
    label: "Basement",
    type: "checkbox"
  },
  {
    name: "flooring",
    label: "Flooring",
    type: "multiselect",
    options: [
      { id: '1', name: 'Hardwood' },
      { id: '2', name: 'Carpet' },
      { id: '3', name: 'Tile' },
      { id: '4', name: 'Vinyl' },
      { id: '5', name: 'Concrete' }
    ]
  },
  {
    name: "exteriorMaterial",
    label: "Exterior Material",
    type: "multiselect",
    options: [
      { id: '1', name: 'Brick' },
      { id: '2', name: 'Vinyl' },
      { id: '3', name: 'Wood' },
      { id: '4', name: 'Stucco' },
      { id: '5', name: 'Stone' }
    ]
  },
  {
    name: "roof",
    label: "Roof",
    type: "select",
    options: [
      { id: '1', name: 'Asphalt' },
      { id: '2', name: 'Metal' },
      { id: '3', name: 'Tile' },
      { id: '4', name: 'Slate' },
      { id: '5', name: 'Other' }
    ]
  },
  {
    name: "nearbyAmenities",
    label: "Nearby Amenities",
    type: "multiselect",
    // options should be populated with common amenities
  },
  {
    name: "energyEfficiencyRating",
    label: "Energy Efficiency Rating",
    type: "text",
    placeholder: "Enter energy efficiency rating (optional)"
  },
  {
    name: "features",
    label: "Features",
    type: "textarea",
    placeholder: "Enter Feature ...",
  },
];

const PropertyForm: FC<Props> = ({ property }) => {
  const { push } = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: property?.title ?? "",
      price: (property?.price as any) ?? "",
      county: property?.county ?? "",
      features: property?.features ?? "",
      listed: property?.listed ?? true,
      status: property?.status ?? "onRent",
      subCounty: property?.subCounty ?? "",
      landMark: property?.landMark ?? "",
      typeId: property?.typeId ?? undefined,
      roadAccessNature: property?.roadAccessNature ?? "Tarmac",
      size: property?.size ?? undefined,
    },
  });
  const { toast } = useToast();

  const onSubmit = async (data: UserFormValue) => {
    try {
      let response;
      if (property)
        response = await fetch(`/api/properties/${property.id}`, {
          method: "PUT",
          body: objectToFormData({ ...data, images }),
          redirect: "follow",
        });
      else
        response = await fetch("/api/properties", {
          method: "POST",
          body: objectToFormData({ ...data, images }),
          redirect: "follow",
        });
      if (response.ok) {
        const _property: Property = await response.json();
        push(`/dashboard/properties/${_property.id}/pay`);
        toast({
          variant: "default",
          title: "Success!.",
          description: `Property ${property ? "updated" : "created"
            } successfully!.KIndly complete payment to complete the process`,
        });
      } else {
        if (response.status === 400) {
          const errors = await response.json();
          for (const key in errors) {
            const errorMessage = (errors[key]._errors as string[]).join(",");
            if (key === "images")
              toast({
                variant: "destructive",
                title: "Success!.",
                description: errorMessage,
              });
            form.setError(key as any, {
              message: errorMessage,
            });
          }
        }
        console.log();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Tabs defaultValue="land">
      <TabsList className="flex justify-center items-center mx-auto max-w-md">
        <TabsTrigger value="land">Land</TabsTrigger>
        <TabsTrigger value="appartments">Appartments</TabsTrigger>
        <TabsTrigger value="home">Home</TabsTrigger>
      </TabsList>
      <TabsContent value="land">
        <BasePropertyForm
          formSchema={landFormSchema}
          defaultValues={
            {
              title: property?.title ?? "",
              price: (property?.price as any) ?? "",
              county: property?.county ?? "",
              features: property?.features ?? "",
              listed: property?.listed ?? true,
              status: property?.status ?? "onRent",
              subCounty: property?.subCounty ?? "",
              landMark: property?.landMark ?? "",
              typeId: property?.typeId ?? undefined,
              roadAccessNature: property?.roadAccessNature ?? "Tarmac",
              size: property?.size ?? undefined,
            }
          }
          onSubmit={onSubmit}
          fields={landFormFields}
          property={property}
        />
      </TabsContent>
      <TabsContent value="appartments">
        <BasePropertyForm
          formSchema={appartmentFormSchema}
          defaultValues={
            {
              title: property?.title ?? "",
              price: (property?.price as any) ?? "",
              county: property?.county ?? "",
              features: property?.features ?? "",
              listed: property?.listed ?? true,
              status: property?.status ?? "onRent",
              subCounty: property?.subCounty ?? "",
              landMark: property?.landMark ?? "",
              typeId: property?.typeId ?? undefined,
              roadAccessNature: property?.roadAccessNature ?? "Tarmac",
              size: property?.size ?? undefined,
            }
          }
          onSubmit={onSubmit}
          fields={appartmentFormFields}
          property={property}
        />
      </TabsContent>
      <TabsContent value="home">
        <BasePropertyForm
          formSchema={homeFormSchema}
          defaultValues={
            {
              title: property?.title ?? "",
              price: (property?.price as any) ?? "",
              county: property?.county ?? "",
              features: property?.features ?? "",
              listed: property?.listed ?? true,
              status: property?.status ?? "onRent",
              subCounty: property?.subCounty ?? "",
              landMark: property?.landMark ?? "",
              typeId: property?.typeId ?? undefined,
              roadAccessNature: property?.roadAccessNature ?? "Tarmac",
              size: property?.size ?? undefined,
            }
          }
          onSubmit={onSubmit}
          fields={homeFormFields}
          property={property}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PropertyForm;
