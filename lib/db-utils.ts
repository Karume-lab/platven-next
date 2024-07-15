// prismaClient.js

import prisma from "@/prisma/client";

export async function getMonthlyPayments() {
  const monthlyPayments = await prisma.$queryRaw`
    SELECT
      TO_CHAR("createdAt", 'Mon') AS name,
      EXTRACT(YEAR FROM "createdAt") AS year,
      SUM("amount") AS total
    FROM "Payment"
    WHERE "complete" = true
    GROUP BY TO_CHAR("createdAt", 'Mon'), EXTRACT(YEAR FROM "createdAt")
    ORDER BY MIN(EXTRACT(MONTH FROM "createdAt"))
  `;

  // Ensure all months of the current year are represented
  const currentYear = new Date().getFullYear();
  const allMonths = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  // Merge the results into the default month array
  const data = allMonths.map((month) => {
    const foundMonth = (monthlyPayments as any).find(
      (mp: any) => mp.name === month.name && mp.year === currentYear,
    );
    return foundMonth
      ? { name: month.name, total: parseFloat(foundMonth.total) }
      : month;
  });

  return data;
}
