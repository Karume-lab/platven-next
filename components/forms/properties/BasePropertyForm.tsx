"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import PropertyLocationPicker from "./location-picker";
import TypeStatusInput from "./type-status";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { basePropertyFormSchema } from "./schema";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false, // Prevent SSR
});


const BasePropertyForm: FC = () => {
  type UserFormValue = z.infer<typeof basePropertyFormSchema>;
  const form = useForm<UserFormValue>({
    resolver: zodResolver(basePropertyFormSchema),
  });



  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g Plativen apartments"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={"listed"}
        render={({ field: formField }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 my-2">
            <FormControl>
              <Checkbox
                checked={formField.value}
                onCheckedChange={formField.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{"Publish Listing"}</FormLabel>
              <FormDescription>{"Make it visible and accessible by the public"}</FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g 4000"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="landMark"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Landmark</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter popular landmark"
                disabled={form.formState.isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <TypeStatusInput />
      <PropertyLocationPicker />
      <FormField
        control={form.control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Features</FormLabel>
            <FormControl>
              <SimpleMDE placeholder="Enter Feature ..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasePropertyForm;
