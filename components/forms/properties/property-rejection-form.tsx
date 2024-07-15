"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Property } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { propertyRejectionSchema } from "./schema";

const formSchema = propertyRejectionSchema;
type UserFormValue = z.infer<typeof formSchema>;

interface Props {
  property: Property;
  onSubmited?: () => void;
}

const PropertyRejectionForm: FC<Props> = ({ property, onSubmited }) => {
  const { toast } = useToast();
  const { refresh } = useRouter();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      const response = await fetch(`/api/properties/${property.id}/reject`, {
        method: "PUT",
        body: JSON.stringify(data),
        redirect: "follow",
      });
      if (response.ok) {
        await response.json();
        refresh();
        toast({
          variant: "default",
          title: "Success!.",
          description: `Property rejected successfully!.`,
        });
        onSubmited?.();
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
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter reason ..."
                  disabled={form.formState.isSubmitting}
                  {...field}
                  rows={4}
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
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default PropertyRejectionForm;
