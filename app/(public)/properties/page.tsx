import FilterForm from "@/components/FilterForm";
import ListLayoutWithSideBar from "@/components/layout/ListLayoutWithSideBar";
import { Badge } from "@/components/ui/badge";
import { formartCurrency } from "@/lib/utils";
import prisma from "@/prisma/client";
import { PropsWithSearchParams } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";
import { z } from "zod";

const filterParams = z.object({
  search: z.string().optional(),
  minPrice: z.number({ coerce: true }).optional(),
  maxPrice: z.number({ coerce: true }).optional(),
  status: z.enum(["onSale", "onRent"]).optional(),
  roadAccessNature: z.enum(["Highway", "Tarmac", "Murram"]).optional(),
  typeId: z.string().uuid().optional(),
});

const PropertiesPage: FC<PropsWithSearchParams> = async ({ searchParams }) => {
  const validation = await filterParams.safeParseAsync(searchParams);
  if (!validation.success) {
    return notFound();
  }
  const { maxPrice, minPrice, search, typeId, status, roadAccessNature } =
    validation.data;
  const properties = await prisma.property.findMany({
    include: { type: true },
    where: {
      listed: true,
      isActive: true,
      payment: { complete: true },
      AND: [
        {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              features: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              county: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              subCounty: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              landMark: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              size: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        { price: { gte: minPrice } },
        { price: { lte: maxPrice } },
        { typeId },
        { status },
        { roadAccessNature },
      ],
    },
  });
  return (
    <ListLayoutWithSideBar sideBar={<FilterForm />}>
      <div className="flex flex-col space-y-2">
        <div className="shadow p-4 rounded-lg text-xl font-bold">
          All Properties
        </div>
        {properties.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4">
            {properties.map(
              (
                {
                  id,
                  title,
                  images,
                  price,
                  county,
                  subCounty,
                  type: { title: type },
                  status,
                },
                index,
              ) => (
                <div
                  key={index}
                  className="w-full border  rounded-lg shadow relative"
                >
                  <Badge className="absolute top-2 left-2 bg-green-700">
                    {status === "onRent" ? "On rent" : "On sales"}
                  </Badge>
                  <Link href={`/properties/${id}`}>
                    {/* <Image
                      className="rounded-t-lg"
                      src={{
                        src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${images[0]}`,
                        height: 500,
                        width: 800,
                      }}
                      alt="product image"
                    /> */}
                    <img
                      className="rounded-t-lg"
                      src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${images[0]}`}
                      alt="product image"
                    />
                  </Link>
                  <div className="px-5 pb-5">
                    <Link href={`/properties/${id}`}>
                      <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {`${title}`}
                      </h5>
                    </Link>
                    <div className="flex flex-col justify-center mt-2.5 mb-5">
                      {`${county} ${subCounty}`}
                    </div>
                    <div className="flex items-center justify-between flex-wrap space-y-6">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {formartCurrency(Number(price))}
                      </span>
                      <Link
                        href={`/properties/${id}`}
                        className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        View Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="p-2 bg-accent rounded-md text-center">
            No properties
          </div>
        )}
      </div>
    </ListLayoutWithSideBar>
  );
};

export default PropertiesPage;
