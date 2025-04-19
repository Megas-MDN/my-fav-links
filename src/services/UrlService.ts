import { UrlModel } from "../models/UrlModel";
import { querySchema } from "../validations/Queries/listAll";
import { createUrlSchema } from "../validations/Url/createUrlSchema";
import { updateUrlSchema } from "../validations/Url/updateUrlSchema";

export class UrlService {
  private urlModel = new UrlModel();

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.urlModel.listAll(validQuery);
  }

  async getById(idUrl: string) {
    return this.urlModel.getById(idUrl);
  }

  async create(data: unknown) {
    const validData = createUrlSchema.parse(data);
    return this.urlModel.create(validData);
  }

  async update(idUrl: string, data: unknown) {
    const validData = updateUrlSchema.parse(data);
    return this.urlModel.update(idUrl, validData);
  }

  async delete(idUrl: string) {
    return this.urlModel.delete(idUrl);
  }
}
