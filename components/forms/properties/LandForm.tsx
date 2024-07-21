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
import { useToast } from "@/components/ui/use-toast";
import { objectToFormData } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Land, Property } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { landFormSchema } from "./schema";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import "easymde/dist/easymde.min.css";
import BasePropertyForm from './BasePropertyForm';

type Props = {
    land?: Land;
    property?: Property;
};

const formSchema = landFormSchema;
type UserFormValue = z.infer<typeof formSchema>;

const LandForm: FC<Props> = ({ land, property }) => {
    const { push } = useRouter();
    const [images, setImages] = useState<File[]>([]);
    const propertyDefaults = {
        title: property?.title ?? "My land",
        price: (property?.price as any) ?? "2",
        county: property?.county ?? "Nairobi",
        subCounty: property?.subCounty ?? "Westlands",
        features: property?.features ?? "",
        listed: property?.listed ?? true,
        status: property?.status ?? "onRent",
        landMark: property?.landMark ?? "Highway",
    };

    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...propertyDefaults,
            size: land?.size ?? "2",
            roadAccessNature: land?.roadAccessNature ?? "Tarmac",
        },
    });

    const { toast } = useToast();

    const onSubmit = async (data: UserFormValue) => {
        try {
            let response;
            if (land) {
                response = await fetch(`/api/properties/land/${land.id}`, {
                    method: "PUT",
                    body: objectToFormData({ ...data, images }),
                    redirect: "follow",
                });
            } else {
                response = await fetch("/api/properties/land", {
                    method: "POST",
                    body: objectToFormData({ ...data, images }),
                    redirect: "follow",
                });
            }
            // if (response.ok) {
            //     const _land: Land = await response.json();
            //     push(`/dashboard/properties/${_land.propertyId}/pay`);
            //     toast({
            //         variant: "default",
            //         title: "Success!",
            //         description: `Property ${land ? "updated" : "created"} successfully! Kindly complete payment to complete the process`,
            //     });
            // } else {
            //     if (response.status === 400) {
            //         const errors = await response.json();
            //         for (const key in errors) {
            //             const errorMessage = (errors[key]._errors as string[]).join(",");
            //             if (key === "images") {
            //                 toast({
            //                     variant: "destructive",
            //                     title: "Action Failed!",
            //                     description: errorMessage,
            //                 });
            //             }
            //             form.setError(key as any, {
            //                 message: errorMessage,
            //             });
            //         }
            //     }
            //     console.log();
            // }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Property Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="roadAccessNature"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nature of road access</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Highway">Highway</SelectItem>
                                                <SelectItem value="Tarmac">Tarmac</SelectItem>
                                                <SelectItem value="Murram">Murram</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Size (square feet size)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="e.g 4000"
                                                disabled={form.formState.isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <BasePropertyForm />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 h-fit">
                        <CardHeader>
                            <CardTitle>Property images</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
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

export default LandForm;
