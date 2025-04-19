import { CardModel } from "../models/CardModel";
import { querySchema } from "../validations/Queries/listAll";
import { createCardSchema } from "../validations/Card/createCardSchema";
import { updateCardSchema } from "../validations/Card/updateCardSchema";

export class CardService {
  private cardModel = new CardModel();

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.cardModel.listAll(validQuery);
  }

  async getById(idCard: string) {
    return this.cardModel.getById(idCard);
  }

  async create(data: unknown) {
    const validData = createCardSchema.parse(data);
    return this.cardModel.create(validData);
  }

  async update(idCard: string, data: unknown) {
    const validData = updateCardSchema.parse(data);
    return this.cardModel.update(idCard, validData);
  }

  async delete(idCard: string) {
    return this.cardModel.delete(idCard);
  }
}
