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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { resetPasswordSchema } from "./schema";
import { User } from "@prisma/client";
import useSessionContext from "@/hooks/useSessionContext";

const formSchema = resetPasswordSchema;

type UserFormValue = z.infer<typeof formSchema>;
const ResetPasswordForm = () => {
  const { signOut } = useSessionContext();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      });
      if (response.ok) {
        await response.json();
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
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
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
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
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
            disabled={form.formState.isSubmitting}
            className="ml-auto w-full"
            type="submit"
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ResetPasswordForm;
