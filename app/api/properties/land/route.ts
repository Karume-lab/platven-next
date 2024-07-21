import { landFormSchema } from "@/components/forms/properties/schema";
import {
  getExpiredCookieHeader,
  getSessionUser,
  strToBool,
} from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { PropertyRoadAccessNature, PropertyStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { detail: "Unauthorized" },
      { status: 401, headers: getExpiredCookieHeader(request) },
    );
  }

  const formData = await request.formData();
  const data = Array.from(formData.entries()).reduce<any>(
    (prev, [key, value]) => {
      if (key === "images") return prev;
      return { ...prev, [key]: value };
    },
    {},
  );
  const propertyData = {
    title: formData.get("title"),
    userId: user.id,
    typeId: "",
    status: formData.get("status") as PropertyStatus,
    price: parseFloat(formData.get("price") as string),
    features: formData.get("features") as string,
    county: formData.get("county") as string,
    subCounty: formData.get("subCounty") as string,
    landMark: formData.get("landMark") as string,
    images: [],
    listed: strToBool(formData.get("listed") as string),
    isActive: user.isStaff || user.isSuperUser,
  };

  const landData = {
    roadAccessNature: formData.get("roadAccessNature") as PropertyRoadAccessNature,
    size: formData.get("size") as string,
  };


  const validation = await landFormSchema.safeParseAsync({
    ...landData,
    listed: strToBool(data.listed),
  });
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const propertyEndpoint = `${request.nextUrl.origin}/api/properties`;

  const propertyResponse = await fetch(propertyEndpoint, {
    method: "POST",
    body: formData,
    headers: {
      'X-User-Id': user.id,
      'X-User-Is-Staff': `${user.isStaff}`,
      'X-User-Is-Super-User': `${user.isSuperUser}`,
    },
  });


  if (!propertyResponse.ok) {
    return NextResponse.json(
      { detail: "Failed to create property" },
      { status: propertyResponse.status },
    );
  }

  const property = await propertyResponse.json();

  const land = await prisma.land.create({
    data: {
      ...validation.data,
      propertyId: property.id,
    },
  });

  return NextResponse.json(land);
};
