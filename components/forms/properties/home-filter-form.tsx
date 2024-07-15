"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { pickBy } from "lodash";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { propertyFilterSchema } from "./schema";
import TypeStatusInput from "./type-status";

const formSchema = propertyFilterSchema;
type UserFormValue = z.infer<typeof formSchema>;

const HomeFilterForm = () => {
  const { push } = useRouter();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      county: "",
      search: "",
      subCounty: "",

      // status: "onRent",
      // typeId: "",
    },
  });
  const onSubmit = async (data: UserFormValue) => {
    const search = new URLSearchParams(pickBy<any>(data, value=>value));
    push(`/properties?${search.toString()}`);
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <div className="flex flex-col py-2 space-y-2 ">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Search ...."
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
              name="minPrice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Min price"
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
              name="maxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Max price"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TypeStatusInput small />
            {/* <PropertyLocationPicker small /> */}
            <div className="row justify-start text-white">
              <Button
                disabled={form.formState.isSubmitting}
                className="ml-auto w-fit flex items-center space-x-2 bg-green-700 mt-5"
                type="submit"
              >
                Find property
                <ArrowRight />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default HomeFilterForm;
