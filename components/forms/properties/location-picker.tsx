import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { County, SubCounty } from "@prisma/client";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
const Select = dynamic(() => import("react-select"), {
  ssr: false, // Prevent SSR
});

type Props = {
  small?: boolean;
};

type UserFormValue = {
  county: string;
  subCounty: string;
};

type CountyDetail = County & {
  _count: { subscounties: number };
  subscounties: SubCounty[];
};

const PropertyLocationPicker: FC<Props> = ({ small }) => {
  const form = useFormContext<UserFormValue>();
  const [search, setSearch] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [counties, setCounties] = useState<CountyDetail[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<CountyDetail>();
  const [selectedSubCounty, setSelectedSubCounty] = useState<SubCounty>();
  const handleSearch = useDebouncedCallback(async (value) => {
    const queryParams = new URLSearchParams({ q: value });
    setLoading(true);
    const response = await fetch(`/api/location?${queryParams.toString()}`, {
      method: "GET",
    });
    setLoading(false);
    if (response.ok) {
      const data: CountyDetail[] = await response.json();
      setCounties(data);
    }
  }, 300);

  useEffect(() => {
    if (search) handleSearch(search);
  }, [search]);

  useEffect(() => {
    if (selectedCounty) {
      form.setValue("county", selectedCounty?.name ?? "");
      form.setValue("subCounty", selectedSubCounty?.name ?? "");
    }
  }, [selectedCounty, selectedSubCounty]);

  return (
    <div
      className={clsx({
        "grid grid-cols-1 lg:grid-cols-2 lg:gap-3": !small,
        "flex flex-col space-y-2": small,
      })}
    >
      <FormField
        control={form.control}
        name="county"
        render={({ field }) => (
          <FormItem>
            {!small && <FormLabel>County</FormLabel>}
            <FormControl>
              <Select
                // isClearable
                placeholder="Search county ..."
                className="dark:text-primary-foreground"
                onInputChange={setSearch}
                isLoading={loading}
                value={{
                  label: selectedCounty?.name ?? field.value,
                  value: selectedCounty?.name ?? field.value,
                }}
                options={[
                  ...counties.map((county) => ({
                    label: county.name,
                    value: county.name,
                  })),
                  ...(!selectedCounty && field.value
                    ? [{ label: field.value, value: field.value }]
                    : []),
                ]}
                onChange={(newValue: any, action) => {
                  setSelectedCounty(
                    counties.find((c) => c.name === newValue?.value),
                  );
                  setSelectedSubCounty(undefined);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="subCounty"
        render={({ field }) => (
          <FormItem>
            {!small && <FormLabel>Sub county</FormLabel>}
            <FormControl>
              <Select
                isClearable
                isLoading={loading}
                placeholder="Select sub county ..."
                className="dark:text-primary-foreground"
                isSearchable
                value={{
                  label: selectedSubCounty?.name ?? field.value,
                  value: selectedSubCounty?.name ?? field.value,
                }}
                defaultInputValue={field.value}
                options={[
                  ...(selectedCounty?.subscounties ?? []).map((subcounty) => ({
                    label: subcounty.name,
                    value: subcounty.name,
                  })),
                  ...(!selectedCounty && field.value
                    ? [{ label: field.value, value: field.value }]
                    : []),
                ]}
                onChange={(newValue: any, action) => {
                  setSelectedSubCounty(
                    selectedCounty?.subscounties.find(
                      (sub) => sub.name === newValue?.value,
                    ),
                  );
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PropertyLocationPicker;
