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
      { id: "Highway", name: "Highway" },
      { id: "Tarmac", name: "Tarmac" },
      { id: "Murram", name: "Murram" },
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
      { id: "Water", name: "Water" },
      { id: "Electricity", name: "Electricity" },
      { id: "Internet", name: "Internet" },
      { id: "Gas", name: "Gas" },
      { id: "Heating", name: "Heating" }
    ]
  },
  {
    name: "amenities",
    label: "Amenities",
    type: "multiselect",
    options: [
      { id: "Parking", name: "Parking" },
      { id: "Gym", name: 'Gym' },
      { id: "Swimming Pool", name: 'Swimming Pool' },
      { id: "Security", name: 'Security' },
      { id: "Elevator", name: 'Elevator' }
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
      { id: 'Single Family', name: 'Single Family' },
      { id: 'Bungalow', name: 'Bungalow' },
      { id: 'Condo', name: 'Condo' },
      { id: 'Multi-Family', name: 'Multi-Family' }
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
      { id: 'Hardwood', name: 'Hardwood' },
      { id: 'Carpet', name: 'Carpet' },
      { id: 'Tile', name: 'Tile' },
      { id: 'Vinyl', name: 'Vinyl' },
      { id: 'Concrete', name: 'Concrete' }
    ]
  },
  {
    name: "exteriorMaterial",
    label: "Exterior Material",
    type: "multiselect",
    options: [
      { id: 'Brick', name: 'Brick' },
      { id: 'Vinyl', name: 'Vinyl' },
      { id: 'Wood', name: 'Wood' },
      { id: 'Stucco', name: 'Stucco' },
      { id: 'Stone', name: 'Stone' }
    ]
  },
  {
    name: "roof",
    label: "Roof",
    type: "select",
    options: [
      { id: 'Asphalt', name: 'Asphalt' },
      { id: 'Metal', name: 'Metal' },
      { id: 'Tile', name: 'Tile' },
      { id: 'Slate', name: 'Slate' },
      { id: 'Other', name: 'Other' }
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
      roadAccessNature: property?.roadAccessNature ?? "Tarmac",
      size: property?.size ?? undefined,
    },
  });
  const { toast } = useToast();

  const onLandSubmit = () => {
    console.log("data")
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
              title: property?.title ?? "sdf",
              price: (property?.price as any) ?? 1.2,
              county: property?.county ?? "Nairobi",
              features: property?.features ?? "Hello",
              listed: property?.listed ?? true,
              status: property?.status ?? "onRent",
              subCounty: property?.subCounty ?? "Westlands",
              landMark: property?.landMark ?? "N",
              roadAccessNature: property?.roadAccessNature ?? "Tarmac",
              size: property?.size ?? "12",
            }
          }
          onSubmit={onLandSubmit}
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
              roadAccessNature: property?.roadAccessNature ?? "Tarmac",
              size: property?.size ?? undefined,
            }
          }
          onSubmit={onLandSubmit}
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
              roadAccessNature: property?.roadAccessNature ?? "Tarmac",
              size: property?.size ?? undefined,
            }
          }
          onSubmit={onLandSubmit}
          fields={homeFormFields}
          property={property}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PropertyForm;
