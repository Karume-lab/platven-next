"use client";
import { FileInput } from "@/components/filedropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Property } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";

import PropertyLocationPicker from "./location-picker";
import TypeStatusInput from "./type-status";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false, // Prevent SSR
});


type Props = {
  formSchema: z.ZodSchema<any>;
  defaultValues: any;
  onSubmit: (data: any) => Promise<void>;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    description?: string;
    min?: number | string,
    options?: Array<{ id: string; name: string; }>;
    required?: boolean,
  }>;
  property?: Property;
};

type UserFormValue = z.infer<Props['formSchema']>;

const BasePropertyForm: FC<Props> = ({ formSchema, defaultValues, onSubmit, fields, property }) => {
  const { push } = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { toast } = useToast();

  const handleSubmit = async (data: UserFormValue) => {
    try {
      await onSubmit({ ...data, images });
    } catch (e) {
      console.log(e);
    }
  };

  const renderField = (field: Props['fields'][0]) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={form.formState.isSubmitting}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'select':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  value={formField.value}
                  defaultValue={formField.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={formField.value}
                        placeholder={`Select ${field.label.toLowerCase()}`}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'checkbox':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 my-2">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.label}</FormLabel>
                  <FormDescription>
                    {field.placeholder}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        );
      case 'textarea':
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <SimpleMDE placeholder={field.placeholder} {...formField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              {fields.map(renderField)}
              <TypeStatusInput />
              <PropertyLocationPicker />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 h-fit">
            <CardHeader>
              <CardTitle>Property images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-3 overflow-x-auto">
                {property?.images.map((image, index) => (
                  <div
                    key={index}
                    className="w-28 h-28 bg-accent rounded-full overflow-clip mb-3"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${image}`}
                      className="w-full h-full object-cover"
                      alt="property image"
                    />
                  </div>
                ))}
              </div>
              <FileInput
                maxFiles={6}
                value={images}
                onValueChange={(files) => {
                  if (files.length <= 6)
                    setImages(
                      files.filter((file) => file.type.includes("image")),
                    );
                }}
              />
              <Button
                disabled={form.formState.isSubmitting}
                className="ml-auto w-full"
                type="submit"
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default BasePropertyForm;