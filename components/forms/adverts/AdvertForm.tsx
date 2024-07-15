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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { objectToFormData } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Advert, PropertyType } from "@prisma/client";
import { User2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { advertValidationSchema } from "./schema";

type Props = {
  advert?: Advert;
};

const formSchema = advertValidationSchema;

type UserFormValue = z.infer<typeof formSchema>;

const AdvertForm: FC<Props> = ({ advert }) => {
  const [image, setImage] = useState<File>();
  const { replace } = useRouter();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: advert?.title ?? "",
      description: advert?.description as any,
    },
  });
  const { toast } = useToast();
  const onSubmit = async (data: UserFormValue) => {
    try {
      let response;
      if (advert)
        response = await fetch(`/api/adverts/${advert.id}`, {
          method: "PUT",
          body: objectToFormData({ ...data, image }),
          redirect: "follow",
        });
      else
        response = await fetch("/api/adverts", {
          method: "POST",
          body: objectToFormData({ ...data, image }),
          redirect: "follow",
        });
      if (response.ok) {
        const propertyType: PropertyType = await response.json();
        replace("/dashboard/adverts");
        toast({
          variant: "default",
          title: "Success!.",
          description: `Advert ${
            propertyType ? "updated" : "created"
          } successfully!.`,
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
                description: `${errorMessage}`,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <Card className="col-span-2 ">
            <CardHeader>
              <CardTitle>Advert Image</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="w-28 h-28 bg-accent rounded-full overflow-clip mb-3">
                {advert?.image ? (
                  // <Image
                  //   src={{
                  //     src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${advert?.image}`,
                  //     width: 100,
                  //     height: 100,
                  //   }}
                  //   className="w-full h-full object-cover"
                  //   alt="profile picture"
                  // />
                  <img
                    src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${advert?.image}`}
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
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Advert Details</CardTitle>
            </CardHeader>
            {/* <Separator /> */}
            <CardContent>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description here ...."
                        disabled={form.formState.isSubmitting}
                        {...field}
                        rows={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button
            disabled={form.formState.isSubmitting}
            className="ml-auto w-full"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdvertForm;
