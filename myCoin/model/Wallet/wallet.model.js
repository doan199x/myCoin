"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const instance = new mongoose_1.default.Schema({
    publicKey: String,
    privateKey: String,
    password: String,
});
exports.default = mongoose_1.default.model("Wallet", instance);
