"use client";
import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const HomeForm: FC = () => {
    return (
        <>
            <FormField
                name="houseNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>House Number</FormLabel>
                        <FormControl>
                            <Input placeholder="House Number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name="numberOfRooms"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Rooms</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Number of Rooms" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name="numberOfBathrooms"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Bathrooms</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Number of Bathrooms" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};

export default HomeForm;
