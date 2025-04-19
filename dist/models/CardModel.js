"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardModel = void 0;
const prisma_1 = require("../db/prisma");
class CardModel {
    async totalCount(query) {
        return prisma_1.prisma.card.count({
            where: {
                title: {
                    contains: query.search,
                },
            },
        });
    }
    async listAll(query) {
        const limit = query.limit || 0;
        const skip = query.page ? (query.page - 1) * limit : query.offset || 0;
        const orderBy = query.orderBy?.map(({ field, direction }) => ({
            [field]: direction,
        })) || [];
        const result = await prisma_1.prisma.card.findMany({
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
    async getById(idCard) {
        return prisma_1.prisma.card.findUnique({
            where: { id: idCard },
            include: { urls: true },
        });
    }
    async create(data) {
        return prisma_1.prisma.card.create({ data });
    }
    async update(idCard, data) {
        return prisma_1.prisma.card.update({
            where: { id: idCard },
            data: { ...data, updatedAt: new Date() },
            include: { urls: true },
        });
    }
    async delete(idCard) {
        return prisma_1.prisma.card.delete({
            where: { id: idCard },
        });
    }
}
exports.CardModel = CardModel;
