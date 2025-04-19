import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { UrlService } from "../services/UrlService";
import { STATUS_CODE } from "../constants/statusCode";

export class UrlController {
  private urlService = new UrlService();

  async listAll(req: CustomRequest<unknown>, res: Response) {
    const result = await this.urlService.listAll(req.query);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async getById(req: CustomRequest<unknown>, res: Response) {
    const result = await this.urlService.getById(req.params.idUrl);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async create(req: CustomRequest<unknown>, res: Response) {
    const result = await this.urlService.create(req.body);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async update(req: CustomRequest<unknown>, res: Response) {
    const result = await this.urlService.update(req.params.idUrl, req.body);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async delete(req: CustomRequest<unknown>, res: Response) {
    const result = await this.urlService.delete(req.params.idUrl);
    return res.status(STATUS_CODE.OK).json(result);
  }
}
