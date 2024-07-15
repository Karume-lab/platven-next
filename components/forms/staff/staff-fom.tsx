"use client";
import { Heading } from "@/components/ui/heading";
import { FC, use } from "react";

import { FileInput } from "@/components/filedropzone";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { objectToFormData } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Team, User } from "@prisma/client";
import { User2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { staffFormSchema } from "./schema";

const formSchema = staffFormSchema;

type StaffFormValue = z.infer<typeof formSchema>;

interface Props {
  user?: User & { team?: Team };
  createFromUser?: boolean;
}

const StaffForm: FC<Props> = ({ user, createFromUser = false }) => {
  const [image, setImage] = useState<File>();
  const [role, setRole] = useState<"staff" | "admin">(
    user?.isSuperUser ? "admin" : "staff",
  );
  const { replace } = useRouter();
  const { toast } = useToast();
  const form = useForm<StaffFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: user?.address ?? "",
      email: user?.email ?? "",
      name: user?.name ?? "",
      phoneNumber: user?.phoneNumber ?? ("" as any),
      position: user?.team?.position ?? "",
      isActive: user?.team?.isActive ?? true,
      type: user?.type ?? "Individual",
      identificationNumber: user?.identificationNumber ?? "",
      isStaff: user?.isStaff ?? true,
      isSuperUser: user?.isSuperUser ?? false,
    },
  });
  const { watch } = form;
  const userType = watch("type");

  const onSubmit = async (data: StaffFormValue) => {
    const payload = {
      ...data,
      image,
      isSuperUser: role === "admin",
      isStaff: role === "staff",
    };
    try {
      let response;
      if (user && !createFromUser)
        response = await fetch(`/api/staff/${user.id}`, {
          method: "PUT",
          body: objectToFormData(payload),
          redirect: "follow",
        });
      else if (user && createFromUser)
        response = await fetch(`/api/user/${user.id}/make-staff`, {
          method: "PUT",
          body: objectToFormData(payload),
          redirect: "follow",
        });
      else
        response = await fetch("/api/staff", {
          method: "POST",
          body: objectToFormData(payload),
          redirect: "follow",
        });
      if (response.ok) {
        const user: User = await response.json();
        replace("/dashboard/staff");
        setImage(undefined);
        toast({
          variant: "default",
          title: "Success!.",
          description: "Profile updated successfully!.",
        });
      } else {
        if (response.status === 400) {
          const errors = await response.json();

          for (const key in errors) {
            const errorMessage = (errors[key]._errors as string[]).join(",");
            if (key === "image")
              toast({
                variant: "destructive",
                title: "Failure!.",
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
    <>
      <div className="flex items-center justify-between">
        <Heading title={"Add Staff"} description={"description"} />
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="w-28 h-28 bg-accent rounded-full overflow-clip mb-3">
            {user?.team?.image ? (
              // <Image
              //   src={{
              //     src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${
              //       user!.team.image
              //     }`,
              //     width: 100,
              //     height: 100,
              //   }}
              //   className="w-full h-full object-cover"
              //   alt="profile picture"
              // />
              <img
                src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${
                  user!.team.image
                }`}
                className="w-full h-full object-cover"
                alt="profile picture"
              />
            ) : (
              <User2 className="w-full h-full opacity-70" />
            )}
          </div>
          <FileInput
            maxFiles={1}
            value={image ? [image] : []}
            onValueChange={(files) => {
              if (
                files.length > 0 &&
                files[files.length - 1].type.includes("image")
              )
                setImage(files[files.length - 1]);
              else setImage(undefined);
            }}
          />
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User type</FormLabel>
                  <Select
                    // disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select user type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      {[
                        { name: "Organization", id: "Organization" },
                        { name: "Individual", id: "Individual" },
                      ].map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                // disabled={loading}
                onValueChange={setRole as any}
                value={role}
                defaultValue={role}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      defaultValue={role}
                      placeholder="Select user role"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* @ts-ignore  */}
                  {[
                    { name: "Staff", id: "staff" },
                    { name: "Super Admin", id: "admin" },
                  ].map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </div>
          <FormField
            control={form.control}
            name="identificationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {userType === "Individual"
                    ? "National id"
                    : "Registration Number"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={"Enter number ..."}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="Staff name ...."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 my-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is Active</FormLabel>
                  <FormDescription>
                    Make it visible and accessible by the public
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="Staff address ..."
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
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={form.formState.isSubmitting}
            className="ml-auto "
            type="submit"
          >
            {"Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default StaffForm;
