import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const q = request.nextUrl.searchParams.get("q") ?? undefined;
  const counties = await prisma.county.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    include: {
      _count: true,
      subscounties: { select: { code: true, countyCode: true, name: true } },
    },
  });
  return NextResponse.json(counties);
};
