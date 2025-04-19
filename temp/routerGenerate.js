const fs = require("fs/promises");
const path = require("path");
const exec = require("child_process").exec;
const rootSrc = path.resolve("src");
const routerFolder = path.resolve(rootSrc, "routes");
const controllerFolder = path.resolve(rootSrc, "controllers");
const serviceFolder = path.resolve(rootSrc, "services");
const modelFolder = path.resolve(rootSrc, "models");
const constants = path.resolve(rootSrc, "constants");
const validations = path.resolve(rootSrc, "validations");

//********************************************* */
let newResourceName = "Card"; // O nome da rota aqui no singula minhaRouta
//********************************************* */

const indexRouteFolder = "_index.ts";
const basePathFile = "basePathRoutes.ts";

const apiVersion = "V1";
const pointOfTheLastImport = `export const routes = Router();`;
const routeUseName = "routes.use";
let importMiddleAuth = "";//`import { auth } from "../auth";`;
let authName = "";//"auth";

const customRequest = `import { CustomRequest } from "../types/custom";`;

console.clear();

const up1 = (word) => word.charAt(0).toUpperCase() + word.slice(1);
const toLashCase = (word) =>
  word
    .replace(/([A-Z])/g, "-$1")
    .trim()
    .toLowerCase();

const routeIndexImportGen = async () => {
  // importação da rota no index.ts
  const indexFile = await fs.readFile(
    path.resolve(routerFolder, indexRouteFolder),
    "utf8",
  );
  const newRouteFile = indexFile.split(pointOfTheLastImport);
  const newRouteFileWithImport =
    newRouteFile[0].trim() +
    `\nimport { ${newResourceName}Routes } from "./${newResourceName}.routes";\n\n` +
    pointOfTheLastImport +
    newRouteFile[1];

  const newRouteFileWithImportAndExportWithRoutes =
    newRouteFileWithImport + `${routeUseName}(${newResourceName}Routes);\n`;
  await fs.writeFile(
    path.resolve(routerFolder, indexRouteFolder),
    newRouteFileWithImportAndExportWithRoutes,
  );
};

const basePathFileGen = async () => {
  const basePath = await fs.readFile(
    path.resolve(constants, basePathFile),
    "utf8",
  );

  const [p1, p2] = basePath.split("export const ROOT_PATH = {");
  if (p2.toUpperCase().includes(newResourceName.toUpperCase())) return;
  const [ob1, ob2] = p2.split("};");
  const newLine =
    `${newResourceName.toUpperCase()}: "/${toLashCase(newResourceName)}",`.trim();

  const newBsePath =
    p1 + `export const ROOT_PATH = {` + ob1 + newLine + ob2 + `};`;
  await fs.writeFile(path.resolve(constants, basePathFile), newBsePath);
};
const routeFileGen = async () => {
  const route = `
import { Router } from "express";
import { ${up1(newResourceName)}Controller } from "../controllers/${up1(
    newResourceName,
  )}Controller";
${importMiddleAuth ? importMiddleAuth : ""}
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";

const BASE_PATH = API_VERSION.${apiVersion} + ROOT_PATH.${newResourceName.toUpperCase()}; // /api/${apiVersion.toLowerCase()}/${toLashCase(newResourceName)}

const ${newResourceName}Routes = Router();

const ${newResourceName}Controller = new ${up1(newResourceName)}Controller();
  
${newResourceName}Routes.get(\`\${BASE_PATH}\`${
    authName ? `, ${authName}` : ""
  }, async (req, res) => { await ${newResourceName}Controller.listAll(req, res) });

${newResourceName}Routes.get(\`\${BASE_PATH}\/:id${up1(newResourceName)}\`${
    authName ? `, ${authName}` : ""
  }, async (req, res) => {
  await ${newResourceName}Controller.getById(req, res);
});

${newResourceName}Routes.post(\`\${BASE_PATH}\`${
    authName ? `, ${authName}` : ""
  }, async (req, res) => {
  await ${newResourceName}Controller.create(req, res);
});

${newResourceName}Routes.put(\`\${BASE_PATH}\/:id${up1(newResourceName)}\`${
    authName ? `, ${authName}` : ""
  }, async (req, res) => {
  await ${newResourceName}Controller.update(req, res);
});

${newResourceName}Routes.delete(\`\${BASE_PATH}\/:id${up1(newResourceName)}\`${
    authName ? `, ${authName}` : ""
  }, async (req, res) => {
  await ${newResourceName}Controller.delete(req, res);
});

export { ${newResourceName}Routes };  
`.trim();
  await fs.writeFile(
    path.resolve(routerFolder, `${newResourceName}.routes.ts`),
    route,
  );
};

const controllerFileGen = async () => {
  const controller = `
import { Response${customRequest ? `` : `, Request`} } from "express";
${customRequest ? customRequest : ""}
import { ${up1(newResourceName)}Service } from "../services/${up1(
    newResourceName,
  )}Service";
import { STATUS_CODE } from "../constants/statusCode";

export class ${up1(newResourceName)}Controller {
  private ${newResourceName}Service = new ${up1(newResourceName)}Service();

  async listAll(req: ${
    customRequest ? `CustomRequest<unknown>` : `Request`
  }, res: Response) {
    const result = await this.${newResourceName}Service.listAll(req.query);
    return res.status(STATUS_CODE.OK).json(result);
  }
  
  async getById(req: CustomRequest<unknown>, res: Response) {
    const result = await this.${newResourceName}Service.getById(Number(req.params.id${up1(newResourceName)}));
    return res.status(STATUS_CODE.OK).json(result);
  }

  async create(req: CustomRequest<unknown>, res: Response) {
    const result = await this.${newResourceName}Service.create(req.body);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async update(req: CustomRequest<unknown>, res: Response) {
    const result = await this.${newResourceName}Service.update(
      Number(req.params.id${up1(newResourceName)}),
      req.body,
    );
    return res.status(STATUS_CODE.OK).json(result);
  }

  async delete(req: CustomRequest<unknown>, res: Response) {
    const result = await this.${newResourceName}Service.delete(Number(req.params.id${up1(newResourceName)}));
    return res.status(STATUS_CODE.OK).json(result);
  }
}
  `.trim();
  await fs.writeFile(
    path.resolve(controllerFolder, `${up1(newResourceName)}Controller.ts`),
    controller,
  );
};

const serviceFileGen = async () => {
  const service =
    `import { ${up1(newResourceName)}Model } from "../models/${up1(
      newResourceName,
    )}Model";
import { querySchema } from "../validations/Queries/listAll";
import { create${up1(newResourceName)}Schema } from "../validations/${up1(newResourceName)}/create${up1(newResourceName)}Schema";
import { update${up1(newResourceName)}Schema } from "../validations/${up1(newResourceName)}/update${up1(newResourceName)}Schema";

export class ${up1(newResourceName)}Service {
  private ${newResourceName}Model = new ${up1(newResourceName)}Model()

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.${newResourceName}Model.listAll(validQuery);
  }
    
  async getById(id${up1(newResourceName)}: number) {
    return this.${newResourceName}Model.getById(id${up1(newResourceName)});
  }

  async create(data: unknown) {
    const validData = create${up1(newResourceName)}Schema.parse(data);
    return this.${newResourceName}Model.create(validData);
  }

  async update(id${up1(newResourceName)}: number, data: unknown) {
    const validData = update${up1(newResourceName)}Schema.parse(data);
    return this.${newResourceName}Model.update(id${up1(newResourceName)}, validData);
  }

  async delete(id${up1(newResourceName)}: number) {
    return this.${newResourceName}Model.delete(id${up1(newResourceName)});
  }
}
  `.trim();

  await fs.writeFile(
    path.resolve(serviceFolder, `${up1(newResourceName)}Service.ts`),
    service,
  );
};

const isPlural = (str) => {
  if (str[str.length - 1] === "s") {
    return true;
  }
  return false;
};
const modelFileGen = async () => {
  const singular = isPlural(newResourceName)
    ? newResourceName.substring(0, newResourceName.length - 1)
    : newResourceName;
  const model = `import { prisma } from "../db/prisma";
import { TQuery } from "../validations/Queries/listAll";
import { TCreate${up1(newResourceName)} } from "../validations/${up1(newResourceName)}/create${up1(newResourceName)}Schema";
import { TUpdate${up1(newResourceName)} } from "../validations/${up1(newResourceName)}/update${up1(newResourceName)}Schema";

export class ${up1(newResourceName)}Model {
  async totalCount(query: TQuery) {
    return prisma.${singular}.count({
      where: {
        name: {
          contains: query.search,
        },
        deletedAt: null,
      },
    });
  }

  async listAll(query: TQuery) {
    const limit = query.limit || 0;
    const skip = query.page ? query.page * limit : query.offset || 0;
    const orderBy =
      query.orderBy?.map(({ field, direction }) => ({
        [field]: direction,
      })) || [];

    const result = await prisma.${singular}.findMany({
      where: {
        name: {
          contains: query.search,
        },
        deletedAt: null,
      },
      take: limit || undefined,
      skip,
      orderBy,
    });

    const totalCount = await this.totalCount(query);

    return { result, totalCount };
  }

  async getById(id${up1(singular)}: number) {
    return prisma.${singular}.findUnique({ where: { id${up1(singular)} } });
  }

  async create(data: TCreate${up1(newResourceName)}) {
    return prisma.${singular}.create({ data });
  }

  async update(id${up1(singular)}: number, data: TUpdate${up1(newResourceName)}) {
    return prisma.${singular}.update({
      where: { id${up1(singular)} },
      data,
    });
  }

  async delete(id${up1(singular)}: number) {
    return prisma.${singular}.update({
      where: { id${up1(singular)} },
      data: { deletedAt: new Date() },
    });
  }
}
  `.trim();

  await fs.writeFile(
    path.resolve(modelFolder, `${up1(newResourceName)}Model.ts`),
    model,
  );
};

const genZodValiddations = async () => {
  const folder = path.resolve(validations, up1(newResourceName));
  await fs.mkdir(folder, { recursive: true });
  const schemaCreate = `import { z } from "zod";

export const create${up1(newResourceName)}Schema = z.object({
});

export type TCreate${up1(newResourceName)} = z.infer<typeof create${up1(newResourceName)}Schema>;`.trim();

  await fs.writeFile(
    path.resolve(folder, `create${up1(newResourceName)}Schema.ts`),
    schemaCreate,
  );

  const schemaUpdate = `import { z } from "zod";

export const update${up1(newResourceName)}Schema = z.object({
});

export type TUpdate${up1(newResourceName)} = z.infer<typeof update${up1(newResourceName)}Schema>;`.trim();

  await fs.writeFile(
    path.resolve(folder, `update${up1(newResourceName)}Schema.ts`),
    schemaUpdate,
  );
};

const setResourceName = () => {
  if (process.argv.length < 3) return;
  const resourceName = process.argv[process.argv.length - 1];
  newResourceName = resourceName ? resourceName : newResourceName;
};

const main = async () => {
  setResourceName();
  if (!newResourceName) return;
  try {
    await fs.readFile(
      path.resolve(controllerFolder, `${up1(newResourceName)}Controller.ts`),
    );
  } catch (_error) {
    await routeIndexImportGen();
  }
  await basePathFileGen();
  await routeFileGen();
  await controllerFileGen();
  await serviceFileGen();
  await modelFileGen();
  await genZodValiddations();

  console.log("Recursos com sucesso");

  // exec(`npx prettier --write .`, (error, stdout) => {
  //   if (error) {
  //     console.error(`Erro ao executar prettier o arquivo: ${error.message}`);
  //   }

  //   console.log(`Saiu com sucesso do prettier: ${stdout}`);
  // });
};

main();
