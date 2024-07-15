"use client";
import { Property, PropertyType } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { appartmentFormSchema, homeFormSchema, landFormSchema } from "./schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "easymde/dist/easymde.min.css";
import BasePropertyForm from "./base-property-form";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type Props = {
  property?: Property;
};

const PropertyForm: FC<Props> = ({ property }) => {
  const [images, setImages] = useState<File[]>([]);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/property-types");
        if (response.ok) {
          const data: PropertyType[] = await response.json();
          setTypes(data);
        }
      } catch (error) {
        console.error("Failed to fetch property types:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const propertyFields = types.reduce((acc, type) => {
    acc[type.id] = type.id === "78364b23-95c3-49a8-b698-04950a728f37" ? {
      fields: [
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
      ],
      defaultValues: {
        title: property?.title ?? "Default Title",
        price: (property?.price as any) ?? 1000,
        county: property?.county ?? "Nairobi",
        features: property?.features ?? "Default Features",
        listed: property?.listed ?? true,
        status: property?.status ?? "onRent",
        subCounty: property?.subCounty ?? "Westlands",
        landMark: property?.landMark ?? "Default Landmark",
        roadAccessNature: property?.roadAccessNature ?? "Tarmac",
        size: property?.size ?? "1000",
      },
    } : type.id === "78364b23-95c3-49a8-b698-04950a728f35" ? {
      fields: [
        {
          name: "noOfBedRooms",
          label: "Number of Bedrooms",
          type: "number",
          placeholder: "Enter number of bedrooms",
          min: 1,
          required: true,
        },
        {
          name: "size",
          label: "Size",
          type: "text",
          placeholder: "Enter size (optional)",
        },
        {
          name: "rentPerMonth",
          label: "Monthly Rent",
          type: "number",
          placeholder: "Enter monthly rent",
          min: 0,
          required: true,
        },
        {
          name: "depositAmount",
          label: "Deposit Amount",
          type: "number",
          placeholder: "Enter deposit amount",
          min: 0,
          required: true,
        },
        {
          name: "availableFrom",
          label: "Available From",
          type: "date",
          min: new Date().toISOString().split('T')[0],
          required: true,
        },
        {
          name: "furnished",
          label: "Furnished",
          type: "checkbox",
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
            { id: "Heating", name: "Heating" },
          ],
        },
        {
          name: "amenities",
          label: "Amenities",
          type: "multiselect",
          options: [
            { id: "Parking", name: "Parking" },
            { id: "Gym", name: "Gym" },
            { id: "Swimming Pool", name: "Swimming Pool" },
            { id: "Security", name: "Security" },
            { id: "Elevator", name: "Elevator" },
          ],
        },
        {
          name: "maxOccupants",
          label: "Maximum Occupants",
          type: "number",
          placeholder: "Enter maximum number of occupants",
          min: 1,
        },
        {
          name: "features",
          label: "Features",
          type: "textarea",
          placeholder: "Enter Feature ...",
        },
      ],
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
    } : {
      fields: [
        {
          name: "noOfBedRooms",
          label: "Number of Bedrooms",
          type: "number",
          placeholder: "Enter number of bedrooms",
          min: 1,
          required: true,
        },
        {
          name: "noOfBathrooms",
          label: "Number of Bathrooms",
          type: "number",
          placeholder: "Enter number of bathrooms",
          min: 1,
          required: true,
        },
        {
          name: "size",
          label: "Size",
          type: "text",
          placeholder: "Enter size",
          required: true,
        },
        {
          name: "plotSize",
          label: "Plot Size",
          type: "text",
          placeholder: "Enter plot size",
        },
        {
          name: "yearBuilt",
          label: "Year Built",
          type: "number",
          placeholder: "Enter year built",
          min: 1800,
          max: new Date().getFullYear(),
          required: true,
        },
        {
          name: "HomeType",
          label: "Home Type",
          type: "select",
          options: [
            { id: "Single Family", name: "Single Family" },
            { id: "Bungalow", name: "Bungalow" },
            { id: "Condo", name: "Condo" },
            { id: "Multi-Family", name: "Multi-Family" },
          ],
          required: true,
        },
        {
          name: "parkingSpaces",
          label: "Parking Spaces",
          type: "number",
          placeholder: "Enter number of parking spaces",
          min: 0,
        },
        {
          name: "basement",
          label: "Basement",
          type: "checkbox",
        },
        {
          name: "flooring",
          label: "Flooring",
          type: "multiselect",
          options: [
            { id: "Hardwood", name: "Hardwood" },
            { id: "Carpet", name: "Carpet" },
            { id: "Tile", name: "Tile" },
            { id: "Vinyl", name: "Vinyl" },
            { id: "Concrete", name: "Concrete" },
          ],
        },
        {
          name: "exteriorMaterial",
          label: "Exterior Material",
          type: "multiselect",
          options: [
            { id: "Brick", name: "Brick" },
            { id: "Vinyl", name: "Vinyl" },
            { id: "Wood", name: "Wood" },
            { id: "Stucco", name: "Stucco" },
            { id: "Stone", name: "Stone" },
          ],
        },
        {
          name: "roof",
          label: "Roof",
          type: "select",
          options: [
            { id: "Asphalt", name: "Asphalt" },
            { id: "Metal", name: "Metal" },
            { id: "Tile", name: "Tile" },
            { id: "Wood", name: "Wood" },
            { id: "Slate", name: "Slate" },
          ],
        },
        {
          name: "heatingType",
          label: "Heating Type",
          type: "select",
          options: [
            { id: "Forced Air", name: "Forced Air" },
            { id: "Radiant", name: "Radiant" },
            { id: "Heat Pump", name: "Heat Pump" },
            { id: "Baseboard", name: "Baseboard" },
            { id: "Geothermal", name: "Geothermal" },
          ],
        },
        {
          name: "coolingType",
          label: "Cooling Type",
          type: "select",
          options: [
            { id: "Central", name: "Central" },
            { id: "Window Unit", name: "Window Unit" },
            { id: "Heat Pump", name: "Heat Pump" },
            { id: "Geothermal", name: "Geothermal" },
          ],
        },
        {
          name: "waterSource",
          label: "Water Source",
          type: "select",
          options: [
            { id: "Public", name: "Public" },
            { id: "Well", name: "Well" },
            { id: "Shared Well", name: "Shared Well" },
            { id: "Cistern", name: "Cistern" },
          ],
        },
        {
          name: "sewer",
          label: "Sewer",
          type: "select",
          options: [
            { id: "Public", name: "Public" },
            { id: "Septic", name: "Septic" },
            { id: "Cesspool", name: "Cesspool" },
          ],
        },
        {
          name: "electricity",
          label: "Electricity",
          type: "select",
          options: [
            { id: "Public", name: "Public" },
            { id: "Generator", name: "Generator" },
            { id: "Solar", name: "Solar" },
          ],
        },
        {
          name: "gas",
          label: "Gas",
          type: "select",
          options: [
            { id: "Public", name: "Public" },
            { id: "Propane", name: "Propane" },
            { id: "Natural", name: "Natural" },
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
      ],
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
    };
    return acc;
  }, {} as Record<string, any>);

  if (isLoading) {
    return <LoadingSpinner>Loading, please wait ...</LoadingSpinner>;
  }

  return (
    <Tabs defaultValue={types[0]?.id}>
      <TabsList className="flex justify-center items-center mx-auto max-w-md">
        {types.map((type) => (
          <TabsTrigger key={type.id} value={type.id}>
            {type.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {types.map((type) => (
        <TabsContent key={type.id} value={type.id}>
          <BasePropertyForm
            formSchema={
              type.id === "78364b23-95c3-49a8-b698-04950a728f37"
                ? landFormSchema
                : type.id === "78364b23-95c3-49a8-b698-04950a728f35"
                  ? appartmentFormSchema
                  : homeFormSchema
            }
            images={images}
            setImages={setImages}
            defaultValues={propertyFields[type.id]?.defaultValues}
            fields={propertyFields[type.id]?.fields}
            property={property}
            typeId={type.id}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PropertyForm;
