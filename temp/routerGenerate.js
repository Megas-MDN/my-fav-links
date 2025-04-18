const fs = require("fs/promises");
const path = require("path");
const exec = require("child_process").exec;
const rootSrc = path.resolve(__dirname, "..", "src");
const routerFolder = path.resolve(rootSrc, "routes");
const controllerFolder = path.resolve(rootSrc, "controllers");
const serviceFolder = path.resolve(rootSrc, "services");
const modelFolder = path.resolve(rootSrc, "models");
const constants = path.resolve(rootSrc, "constants");
const validations = path.resolve(rootSrc, "validations");

//********************************************* */
let newResourceName = ""; /// O nome da rota aqui
//********************************************* */

const indexRouteFolder = "_index.ts";
const basePathFile = "basePathRoutes.ts";

const apiVersion = "V1";
const pointOfTheLastImport = `export const routes = Router();`;
const routeUseName = "routes.use";
let importMiddleAuth = ""; // `import { auth } from "../auth";`;
let authName = "";

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
${importMiddleAuth ? importMiddleAuth : ""}
import { ${up1(newResourceName)}Controller } from "../controllers/${up1(
    newResourceName,
  )}Controller";
import { ${up1(newResourceName)}Service } from "../services/${up1(
    newResourceName,
  )}Service";
import { ${up1(newResourceName)}Model } from "../models/${up1(
    newResourceName,
  )}Model";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";

const BASE_PATH = API_VERSION.${apiVersion} + ROOT_PATH.${newResourceName.toUpperCase()}; // /api/${apiVersion.toLowerCase()}/${newResourceName.toLowerCase()}

const ${newResourceName}Routes = Router();

const ${newResourceName}Controller = new ${up1(newResourceName)}Controller();
  
${newResourceName}Routes.get(\`\${BASE_PATH}\`${
    authName ? `, ${authName}` : ""
  }, async (req, res) => { await ${newResourceName}Controller.listAll(req, res) });

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
}
  `.trim();
  await fs.writeFile(
    path.resolve(controllerFolder, `${up1(newResourceName)}Controller.ts`),
    controller,
  );
};

const serviceFileGen = async () => {
  const service = `
import { ${up1(newResourceName)}Model } from "../models/${up1(
    newResourceName,
  )}Model";
import { querySchema } from "../validations/Queries/listAll";

export class ${up1(newResourceName)}Service {
  private ${newResourceName}Model = new ${up1(newResourceName)}Model()

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.${newResourceName}Model.listAll(validQuery);
  }
}
  `.trim();

  await fs.writeFile(
    path.resolve(serviceFolder, `${up1(newResourceName)}Service.ts`),
    service,
  );
};

const modelFileGen = async () => {
  const model = `import { prisma } from "../db/prisma";
  import { TQuery } from "../validations/Queries/listAll";

export class ${up1(newResourceName)}Model {
  async listAll(query: TQuery) {
    const limit = query.limit || 20;
    const skip = query.page ? query.page * limit : query.offset || 0;
    const orderBy =
      query.orderBy?.map(({ field, direction }) => ({
        [field]: direction,
      })) || [];

    return { result: [], totalCount: 0, limit, skip, orderBy };
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
  const resourceName =  process.argv[process.argv.length - 1]

  newResourceName =
    resourceName
      ? resourceName
      : newResourceName;
};

const main = async () => {
  setResourceName();
  if(!newResourceName) return;
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

  exec(`npx prettier --write .`, (error, stdout) => {
    if (error) {
      console.error(`Erro ao executar prettier o arquivo: ${error.message}`);
    }

    console.log(`Saiu com sucesso do prettier: ${stdout}`);
  });
};

main();
