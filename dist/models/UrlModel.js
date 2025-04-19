"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlModel = void 0;
const prisma_1 = require("../db/prisma");
class UrlModel {
    async totalCount(query) {
        return prisma_1.prisma.url.count({
            where: {
                value: {
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
        const result = await prisma_1.prisma.url.findMany({
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
    async getById(idUrl) {
        return prisma_1.prisma.url.findUnique({ where: { id: idUrl } });
    }
    async create(data) {
        return prisma_1.prisma.url.create({ data });
    }
    async update(idUrl, data) {
        return prisma_1.prisma.url.update({
            where: { id: idUrl },
            data,
        });
    }
    async delete(idUrl) {
        return prisma_1.prisma.url.delete({
            where: { id: idUrl },
        });
    }
}
exports.UrlModel = UrlModel;
