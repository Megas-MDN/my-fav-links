"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const CardModel_1 = require("../models/CardModel");
const listAll_1 = require("../validations/Queries/listAll");
const createCardSchema_1 = require("../validations/Card/createCardSchema");
const updateCardSchema_1 = require("../validations/Card/updateCardSchema");
class CardService {
    constructor() {
        this.cardModel = new CardModel_1.CardModel();
    }
    async listAll(query) {
        const validQuery = listAll_1.querySchema.parse(query);
        return this.cardModel.listAll(validQuery);
    }
    async getById(idCard) {
        return this.cardModel.getById(idCard);
    }
    async create(data) {
        const validData = createCardSchema_1.createCardSchema.parse(data);
        return this.cardModel.create(validData);
    }
    async update(idCard, data) {
        const validData = updateCardSchema_1.updateCardSchema.parse(data);
        return this.cardModel.update(idCard, validData);
    }
    async delete(idCard) {
        return this.cardModel.delete(idCard);
    }
}
exports.CardService = CardService;
