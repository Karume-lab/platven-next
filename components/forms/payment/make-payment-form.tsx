"use client";
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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Payment, Property } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mpesaPaymentSchema } from "./schem";

const formSchema = mpesaPaymentSchema;
type UserFormValue = z.infer<typeof formSchema>;
type PropertyWithPayment = Property & { payment?: Payment };
type Props = { property: PropertyWithPayment };

const MakePaymentForm: FC<Props> = ({ property }) => {
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: (property as any)?.user?.phoneNumber,
      property: property.id,
    },
  });
  const { refresh, replace } = useRouter();
  const { toast } = useToast();
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const onSubmit = async (data: UserFormValue) => {
    try {
      const response = await fetch("/api/mpesa", {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      });
      if (response.ok) {
        const data = await response.json();
        setPaymentInitiated(true);
        // refresh();
        // toast({
        //   variant: "default",
        //   title: "Success!.",
        //   description:
        //     "Payment Initiated successfully!.Please complete your payment",
        // });
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

  const handleFetchPropertyStatus = async () => {
    try {
      const response = await fetch(
        `/api/properties/${property.id}/payment-status`,
        {
          method: "GET",
          redirect: "follow",
        },
      );
      if (response.ok) {
        const data: PropertyWithPayment = await response.json();
        if (data.payment?.complete) {
          toast({
            variant: "default",
            title: "Success!.",
            description:
              "Payment has been received succesfully!.Than you for choosing platven",
          });
          replace(`/dashboard/properties/`);
        } else {
          toast({
            variant: "destructive",
            title: "Failure!.",
            description: "Payment has not been received!, Please try again",
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
        {paymentInitiated && (
          <div className="rounded-md bg-muted p-4">
            Payment has beeen initiated succesfully, Enter your pin on you phone
            mpesa prompt to confirm payment and click the complete payment if
            succesfull
          </div>
        )}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mpesa phone number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="e.g 700000000"
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
          name="property"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Property</FormLabel> */}
              <FormControl>
                <Input
                  type="hidden"
                  placeholder="********"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting || paymentInitiated}
          className="ml-auto w-full"
          type="submit"
        >
          Make Payment
        </Button>
        <Button
          disabled={form.formState.isSubmitting}
          className="ml-auto w-full"
          onClick={handleFetchPropertyStatus}
        >
          Complete payment
        </Button>
      </form>
    </Form>
  );
};

export default MakePaymentForm;
