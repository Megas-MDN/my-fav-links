"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlController = void 0;
const UrlService_1 = require("../services/UrlService");
const statusCode_1 = require("../constants/statusCode");
class UrlController {
    constructor() {
        this.urlService = new UrlService_1.UrlService();
    }
    async listAll(req, res) {
        const result = await this.urlService.listAll(req.query);
        return res.status(statusCode_1.STATUS_CODE.OK).json(result);
    }
    async getById(req, res) {
        const result = await this.urlService.getById(req.params.idUrl);
        return res.status(statusCode_1.STATUS_CODE.OK).json(result);
    }
    async create(req, res) {
        const result = await this.urlService.create(req.body);
        return res.status(statusCode_1.STATUS_CODE.CREATED).json(result);
    }
    async update(req, res) {
        const result = await this.urlService.update(req.params.idUrl, req.body);
        return res.status(statusCode_1.STATUS_CODE.OK).json(result);
    }
    async delete(req, res) {
        const result = await this.urlService.delete(req.params.idUrl);
        return res.status(statusCode_1.STATUS_CODE.OK).json(result);
    }
}
exports.UrlController = UrlController;
