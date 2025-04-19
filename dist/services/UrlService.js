"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlService = void 0;
const UrlModel_1 = require("../models/UrlModel");
const listAll_1 = require("../validations/Queries/listAll");
const createUrlSchema_1 = require("../validations/Url/createUrlSchema");
const updateUrlSchema_1 = require("../validations/Url/updateUrlSchema");
class UrlService {
    constructor() {
        this.urlModel = new UrlModel_1.UrlModel();
    }
    async listAll(query) {
        const validQuery = listAll_1.querySchema.parse(query);
        return this.urlModel.listAll(validQuery);
    }
    async getById(idUrl) {
        return this.urlModel.getById(idUrl);
    }
    async create(data) {
        const validData = createUrlSchema_1.createUrlSchema.parse(data);
        return this.urlModel.create(validData);
    }
    async update(idUrl, data) {
        const validData = updateUrlSchema_1.updateUrlSchema.parse(data);
        return this.urlModel.update(idUrl, validData);
    }
    async delete(idUrl) {
        return this.urlModel.delete(idUrl);
    }
}
exports.UrlService = UrlService;
