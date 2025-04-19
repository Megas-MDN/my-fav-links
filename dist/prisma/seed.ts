import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs/promises";

const prisma = new PrismaClient();

const DATABASE_URL = process.env.DATABASE_URL;
const LOCAL = "172.28.30.156:";
const SEEDS_FOLDER_NAME = ""; // "seeds" folder inside temp folder: ex: "temp/SEEDS_FOLDER_NAME"

async function main() {
  if (!DATABASE_URL?.includes(LOCAL))
    throw new Error("DATABASE_URL is not localhost");

  const isDroped = true;
  let limit = 10;

  let tablesTryAgain: Prisma.ModelName[] = [];
  const tables = Object.keys(Prisma.ModelName) as Prisma.ModelName[];
  const MAX = limit;

  const snakeToCamel = (str: string) =>
    str.toLocaleLowerCase().replace(/([-_][a-z0-9])/g, (undeScoreAndString) => {
      return undeScoreAndString.toUpperCase().replace("-", "").replace("_", "");
    });

  const readFile = async (path: string) => {
    try {
      const data = await fs.readFile(
        `./temp/${SEEDS_FOLDER_NAME || "seeds"}/${path}`,
        "utf8",
      );
      const dataParse = JSON.parse(data);
      if (Array.isArray(dataParse)) return dataParse;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      /* empty */
    }
    return [];
  };

  const seedTable = async (table: Prisma.ModelName) => {
    const data = await readFile(`${snakeToCamel(table)}.json`);

    try {
      tablesTryAgain = tablesTryAgain.filter((t) => t !== table);
      await prisma[table].createMany({ data });
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientRustPanicError
      ) {
        if (error.message.toLowerCase().includes("bigint")) {
          try {
            const newData = data.map((item) => {
              return { ...item, sent_timestamp: BigInt(item.sent_timestamp) };
            });
            await prisma[table].createMany({
              data: newData,
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (err) {
            /* empty */
          }
        } else if (!error.message.toLowerCase().includes("unique constraint")) {
          tablesTryAgain.push(table);
        }
      }
    }
  };

  const dropAll = async (arrTables = tables) => {
    for (let i = 0; i < arrTables.length; i++) {
      const table = arrTables[i];
      try {
        tablesTryAgain = tablesTryAgain.filter((t) => t !== table);
        await prisma[table].deleteMany({});
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        tablesTryAgain.push(table);
      }
    }
  };
  const seedAll = async () => {
    for (let i = 0; i < tables.length; i++) {
      await seedTable(tables[i] as Prisma.ModelName);
    }
  };
  console.clear();
  console.log("----------------------------");

  if (isDroped) {
    await dropAll();
    if (tablesTryAgain.length > 0) {
      while (tablesTryAgain.length > 0 && limit-- > 0) {
        await dropAll(tablesTryAgain);
      }
    }
    console.log(
      "The end",
      tablesTryAgain,
      "<-- Tables to seed (Number of Fails [${tablesTryAgain.length}]) | Number of trys: ",
      MAX - limit,
    );
    console.log("------END---DROP--ALL--XXXXX--------------");
    limit = MAX;
    tablesTryAgain = [];
  }

  console.log("------ Wait for seed all ----------------");
  await seedAll();

  if (tablesTryAgain.length > 0) {
    while (tablesTryAgain.length > 0 && limit-- > 0) {
      await seedAll();
    }
  }

  console.log(
    "The end",
    tablesTryAgain,
    "<-- Tables to seed (Number of Fails [${tablesTryAgain.length}]) | Number of trys: ",
    MAX - limit,
  );
}

main()
  .then(async () => {
    if (!DATABASE_URL?.includes(LOCAL))
      throw new Error("DATABASE_URL is not localhost:3322");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
