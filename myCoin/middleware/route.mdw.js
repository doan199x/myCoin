"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../route/wallet/index"));
function default_1(app) {
    app.use("/wallet", index_1.default);
}
exports.default = default_1;
