const { PrismaClient } = require("@prisma/client");

type Constiuency = {
  name: string;
  code: string;
};

type County = {
  name: string;
  number: string;
  capital: string;
  constituencies: Constiuency[];
};

async function seedKenyanDemographicUnits() {
  const counties = require("./counties.json") as County[];
  const prisma = new PrismaClient();
  console.log(`[+] Clearing demgraphic unit tables ....`);
  await prisma.county.deleteMany({
    where: { code: { in: counties.map((c) => c.number) } },
  });
  console.log(`[+] Clearing demgraphic unit tables ....`);

  const tasks = counties.map(({ capital, constituencies, name, number }) =>
    prisma.county.create({
      data: {
        capital,
        code: number,
        name,
        subscounties: {
          createMany: { data: constituencies },
        },
      },
    }),
  );
  return await Promise.all(tasks);
}

async function main() {
  console.log("[+]Starting seed ...");
  const counties = await seedKenyanDemographicUnits();
  console.log(`[+] Finished. Seeded ${counties.length} counties`);
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err,
  );
});
