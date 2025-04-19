import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { CardService } from "../services/CardService";
import { STATUS_CODE } from "../constants/statusCode";

export class CardController {
  private cardService = new CardService();

  async listAll(req: CustomRequest<unknown>, res: Response) {
    const result = await this.cardService.listAll(req.query);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async getById(req: CustomRequest<unknown>, res: Response) {
    const result = await this.cardService.getById(req.params.idCard);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async create(req: CustomRequest<unknown>, res: Response) {
    const result = await this.cardService.create(req.body);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async update(req: CustomRequest<unknown>, res: Response) {
    const result = await this.cardService.update(req.params.idCard, req.body);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async delete(req: CustomRequest<unknown>, res: Response) {
    const result = await this.cardService.delete(req.params.idCard);
    return res.status(STATUS_CODE.OK).json(result);
  }
}
