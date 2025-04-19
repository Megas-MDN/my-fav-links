import { prisma } from "../db/prisma";
import { TQuery } from "../validations/Queries/listAll";
import { TCreateUrl } from "../validations/Url/createUrlSchema";
import { TUpdateUrl } from "../validations/Url/updateUrlSchema";

export class UrlModel {
  async totalCount(query: TQuery) {
    return prisma.url.count({
      where: {
        value: {
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

    const result = await prisma.url.findMany({
      where: {
        value: {
          contains: query.search,
        },
      },
      take: limit || undefined,
      skip,
      orderBy,
    });

    const totalCount = await this.totalCount(query);

    return { result, totalCount };
  }

  async getById(idUrl: string) {
    return prisma.url.findUnique({ where: { id: idUrl } });
  }

  async create(data: TCreateUrl) {
    return prisma.url.create({ data });
  }

  async update(idUrl: string, data: TUpdateUrl) {
    return prisma.url.update({
      where: { id: idUrl },
      data,
    });
  }

  async delete(idUrl: string) {
    return prisma.url.delete({
      where: { id: idUrl },
    });
  }
}
