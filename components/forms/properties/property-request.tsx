"use client";

import { FC } from "react";
import { propertyRequestFormSchema } from "./schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Property, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  property: Property;
  user?: User;
};

const formSchema = propertyRequestFormSchema;
type UserFormValue = z.infer<typeof formSchema>;

const PropertyRequestForm: FC<Props> = ({ property, user }) => {
  const { toast } = useToast();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "" as any,
      message: "",
      name: user?.name ?? "",
      propertyId: property.id,
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      const response = await fetch("/api/property-request", {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      });
      if (response.ok) {
        await response.json();
        toast({
          title: "Success!!",
          description: "Property request submition success.",
        });
        form.reset();
      } else {
        if (response.status === 400) {
          const errors = await response.json();

          for (const key in errors) {
            const errorMessage = (errors[key]._errors as string[]).join(",");

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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="e.g Joh Doe"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="e.g abc@platven.co.ke"
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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="e.g 712345678"
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
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Leave message here ..."
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            className="ml-auto w-full"
            type="submit"
          >
            Sumit Request
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PropertyRequestForm;
