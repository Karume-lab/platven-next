"use client";
import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const ApartmentForm: FC = () => {
    const { control } = useFormContext();

    return (
        <>
            <FormField
                control={control}
                name="noOfBedRooms"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Bedrooms</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" placeholder="Number of Bedrooms" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="rentPerMonth"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Rent Per Month</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" placeholder="Rent Per Month" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};

export default ApartmentForm;
