"use client";
import { FC, useEffect, useState } from "react";
import { Land, Property, PropertyType } from "@prisma/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LandForm from "./LandForm";
import HomeForm from "./HomeForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import ApartmentForm from "./AppartmentForm";


type PropertyFormProps = {
  property?: Property | Land;
};

const PropertyForm: FC<PropertyFormProps> = ({ property }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const { toast } = useToast();


  const propertyForms: Record<string, JSX.Element> = {
    "78364b23-95c3-49a8-b698-04950a728f37": <LandForm />,
    "78364b23-95c3-49a8-b698-04950a728f35": <ApartmentForm />,
    "78364b23-95c3-49a8-b698-04950a728f40": <HomeForm />,
  };


  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/property-types");
        if (response.ok) {
          const data: PropertyType[] = await response.json();
          setTypes(data);
        } else {
          throw new Error("Failed to fetch property types");
        }
      } catch (error) {
        console.error("Failed to fetch property types:", error);
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Failed to fetch property types",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyTypes();
  }, [toast]);

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
          {propertyForms[type.id]}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PropertyForm;
