import { prisma } from "../db/prisma";
import { TQuery } from "../validations/Queries/listAll";
import { TCreateCard } from "../validations/Card/createCardSchema";
import { TUpdateCard } from "../validations/Card/updateCardSchema";

export class CardModel {
  async totalCount(query: TQuery) {
    return prisma.card.count({
      where: {
        title: {
          contains: query.search,
        },
      },
    });
  }

  async listAll(query: TQuery) {
    const limit = query.limit || 0;
    const skip = query.page ? (query.page - 1) * limit : query.offset || 0;
    const orderBy =
      query.orderBy?.map(({ field, direction }) => ({
        [field]: direction,
      })) || [];

    const result = await prisma.card.findMany({
      where: {
        title: {
          contains: query.search,
        },
      },
      include: {
        urls: true,
      },
      take: limit || undefined,
      skip,
      orderBy: orderBy.length > 0 ? orderBy : { lastViewed: "asc" },
    });

    const totalCount = await this.totalCount(query);

    return { result, totalCount };
  }

  async getById(idCard: string) {
    return prisma.card.findUnique({ where: { id: idCard } });
  }

  async create(data: TCreateCard) {
    return prisma.card.create({ data });
  }

  async update(idCard: string, data: TUpdateCard) {
    return prisma.card.update({
      where: { id: idCard },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async delete(idCard: string) {
    return prisma.card.delete({
      where: { id: idCard },
    });
  }
}
