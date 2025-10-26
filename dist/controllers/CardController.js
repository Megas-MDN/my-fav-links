"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const CardService_1 = require("../services/CardService");
const statusCode_1 = require("../constants/statusCode");
const prisma_1 = __importDefault(require("../db/prisma"));
class CardController {
    constructor() {
        this.cardService = new CardService_1.CardService();
    }
    async listAll(req, res) {
        const result = await this.cardService.listAll(req.query);
        return res.status(statusCode_1.STATUS_CODE.OK).json(result);
    }
    async getById(req, res) {
        const result = await this.cardService.getById(req.params.idCard);
        return res.status(statusCode_1.STATUS_CODE.OK).json(result);
    }
    async create(req, res) {
        const result = await this.cardService.create(req.body);
        return res.status(statusCode_1.STATUS_CODE.CREATED).json(result);
    }
    async update(req, res) {
        const result = await this.cardService.update(req.params.idCard, req.body);
        return res.status(statusCode_1.STATUS_CODE.OK).json(result);
    }
    async reorder(req, res) {
        const { items } = req.body; // [{ id: string, order: number }]
        if (!Array.isArray(items))
            return res.status(400).send("Invalid format");
        const operations = items.map((item) => prisma_1.default.card.update({
            where: { id: item.id },
            data: { order: item.order },
        }));
        await prisma_1.default.$transaction(operations);
        res.status(200).json({ message: "Order updated successfully" });
    }
    async delete(req, res) {
        const result = await this.cardService.delete(req.params.idCard);
        return res.status(statusCode_1.STATUS_CODE.OK).json(result);
    }
}
exports.CardController = CardController;
