"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const CardService_1 = require("../services/CardService");
const statusCode_1 = require("../constants/statusCode");
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
    async delete(req, res) {
        const result = await this.cardService.delete(req.params.idCard);
        return res.status(statusCode_1.STATUS_CODE.OK).json(result);
    }
}
exports.CardController = CardController;
