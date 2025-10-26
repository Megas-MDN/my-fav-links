import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { CardService } from "../services/CardService";
import { STATUS_CODE } from "../constants/statusCode";
import prisma from "../db/prisma";

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

  async reorder(req: CustomRequest<unknown>, res: Response) {
    const { items } = req.body; // [{ id: string, order: number }]
    if (!Array.isArray(items)) return res.status(400).send("Invalid format");

    const operations = items.map((item) =>
      prisma.card.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );

    await prisma.$transaction(operations);

    res.status(200).json({ message: "Order updated successfully" });
  }

  async delete(req: CustomRequest<unknown>, res: Response) {
    const result = await this.cardService.delete(req.params.idCard);
    return res.status(STATUS_CODE.OK).json(result);
  }
}
