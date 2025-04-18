const { PrismaClient, Prisma } = require("@prisma/client");
const fs = require("fs/promises");

const prisma = new PrismaClient();

const snakeToCamel = (str) =>
  str.toLocaleLowerCase().replace(/([-_][a-z0-9])/g, (undeScoreAndString) => {
    return undeScoreAndString.toUpperCase().replace("-", "").replace("_", "");
  });

const writeTable = async ({ table, value, folder }) => {
  const tableNameCamelCase = snakeToCamel(table);
  const dir = `./temp/${folder}`;
  await fs.mkdir(dir, { recursive: true });
  try {
    const str = JSON.stringify(value, null, 2);
    return fs.writeFile(`${dir}/${tableNameCamelCase}.json`, `${str}`);
  } catch (error) {
    console.log(error.message, "<<<-- message --> Table: ", table);
    if (error.message.toLocaleLowerCase().includes("bigint")) {
      let item = value;
      try {
        const itemArr = value.map((item) => {
          for (const k of Object.keys(item)) {
            if (typeof item[k] === "bigint") {
              item[k] = item[k].toString();
            }
          }
          return item;
        });
        return await fs.writeFile(
          `${dir}/${tableNameCamelCase}.json`,
          JSON.stringify(itemArr, null, 2),
        );
      } catch (error) {
        console.log(item, "<<<-- continua Zoado");
        console.log("\n\n");
        return;
      }
    }
    console.log(value, "<<<-- value");
    console.log("\n\n");
    return;
  }
};

const options = ({ key, value }) => {
  switch (true) {
    case key === "created_date" || key === "updated_date":
      return new Date(value);

    case key === "deleted_date" && Boolean(value):
      return new Date(value);

    case key === "deleted_date":
      return null;

    default:
      return value;
  }
};

const removeNullElements = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = options({ key, value: obj[key] });
    if (value === null || value === undefined) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
};

const filteredFields = ({ obj, filter }) => {
  const { keyToFilter, replaceTo } = filter;
  return Object.keys(obj).reduce((acc, key) => {
    if (key === keyToFilter) {
      if (replaceTo === undefined) {
        return acc;
      }
      acc[key] = replaceTo;
      return acc;
    }
    acc[key] = obj[key];
    return acc;
  }, {});
};

const filterTables = ({ obj, filters, key }) => {
  return filters.reduce((acc, filter) => {
    if (filter.inTable && filter.inTable !== key) {
      return acc;
    }
    return filteredFields({ obj: acc, filter });
  }, obj);
};

const createAllSeeds = async ({ tables, folder }) => {
  await Promise.allSettled(
    Object.keys(tables).map((key) => {
      writeTable({ table: key, value: tables[key], folder });
    }),
  );
};

// Stack to try again -- Tables to re try the find All if some promisse is rejected.
const stackTryAgain = {};

const findAndRefind = async ({ tables, internalFilters }) => {
  const selectsAll = await Promise.allSettled(
    tables.map((table) => {
      return prisma[table].findMany({});
    }),
  );

  const merged = selectsAll.reduce((acc, result, i) => {
    if (result.status !== "fulfilled") {
      console.log("Error", result.reason, "<---Try Again XXXXX");
      stackTryAgain[tables[i]] = (stackTryAgain[tables[i]] || 0) + 1;
      return acc;
    }

    delete stackTryAgain[tables[i]];
    acc[tables[i]] = result.value.map((item) =>
      filterTables({
        obj: removeNullElements(item),
        filters: internalFilters,
        key: tables[i],
      }),
    );
    return acc;
  }, {});

  return merged;
};
const readAllTables = async ({
  allSeeds = false,
  logTables = true,
  arrFilters = [],
  onlyTables = [], // only especific tables
  folderName = "newSeeds",
} = {}) => {
  const tables =
    onlyTables.length > 0
      ? onlyTables
      : Object.keys(Prisma.ModelName).filter(
          (t) =>
            t !== "network_performance_types" && t !== "network_performance",
        );

  const merged = !allSeeds
    ? {}
    : await findAndRefind({ tables, internalFilters: arrFilters });

  const MAX_TRY_AGAIN = 3;
  let breakWhile = 10; // safe condition

  if (Object.keys(stackTryAgain).length > 0) {
    console.log(JSON.stringify(stackTryAgain, null, 2), "<--- stackTryAgain");
    console.log("\n **************** Go run while ************** \n");
    while (
      Object.keys(stackTryAgain).length > 0 &&
      Object.values(stackTryAgain).some((v) => v < MAX_TRY_AGAIN) &&
      breakWhile-- > 0
    ) {
      const newMerge = await findAndRefind({
        tables: Object.keys(stackTryAgain),
        internalFilters: arrFilters,
      });
      Object.assign(merged, newMerge);
    }
  }

  logTables && console.log("Start -->", merged, "<-- End");
  allSeeds && (await createAllSeeds({ tables: merged, folder: folderName }));

  console.log("Done ---");
  return { tables, collections: merged, stackTryAgain };
};

readAllTables({
  allSeeds: true,
  logTables: false,
  folderName: `seeds`,
  onlyTables: [], // Only this tables,
});

module.exports = readAllTables;
