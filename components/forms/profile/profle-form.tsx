"use client";

import { FileInput } from "@/components/filedropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { useToast } from "@/components/ui/use-toast";
import useSessionContext from "@/hooks/useSessionContext";
import { objectToFormData } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { User2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userProfileSchema } from "./schema";

type Props = {
  user?: User;
};

const formSchema = userProfileSchema;

type UserFormValue = z.infer<typeof formSchema>;

const ProfileForm: FC<Props> = ({ user }) => {
  const { setUser } = useSessionContext();
  const { refresh } = useRouter();
  const [image, setImage] = useState<File>();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email ?? "",
      address: user?.address ?? "",
      name: user?.name ?? "",
      phoneNumber: user?.phoneNumber ?? ("" as any),
      identificationNumber: user?.identificationNumber ?? "",
      type: user?.type ?? "Individual",
    },
  });
  const { toast } = useToast();
  const { watch } = form;
  const userType = watch("type");

  const onSubmit = async (data: UserFormValue) => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: objectToFormData({ ...data, image }),
        redirect: "follow",
      });
      if (response.ok) {
        const user: User = await response.json();
        setUser(user);
        refresh();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
        <div className="flex flex-col space-y-2 ">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 pt-8">
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile picture</CardTitle>
                </CardHeader>

                <CardContent className="space-y-10">
                  <div className="w-28 h-28 bg-accent rounded-full overflow-clip mb-3">
                    {user?.image ? (
                      // <Image
                      //   src={{
                      //     src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${user?.image}`,
                      //     width: 100,
                      //     height: 100,
                      //   }}
                      //   className="w-full h-full object-cover"
                      //   alt="profile picture"
                      // />
                      <img
                        src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${user?.image}`}
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
                  <Button
                    disabled={form.formState.isSubmitting}
                    className="ml-auto w-full"
                    type="submit"
                  >
                    Update
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Update Profile</CardTitle>
                </CardHeader>
                <CardContent>
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
                            placeholder="e.g John Doe"
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
                            placeholder="e.g 0793889658"
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter you address ..."
                            disabled={form.formState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
