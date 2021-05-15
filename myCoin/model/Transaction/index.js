"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const Wallet_1 = require("../Wallet");
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    calculateHash() {
        return sha256_1.default(this.fromAddress + this.toAddress + this.amount).toString();
    }
    signTransactions(signingKey) {
        if (signingKey.getPublic("hex") !== this.fromAddress) {
            throw new Error("You can not sign transactions for other wallets!");
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, "base64");
        this.signature = sig.toDER("hex");
    }
    isValid() {
        if (this.fromAddress === null)
            return true;
        if (!this.signature || this.signature.length === 0) {
            throw new Error("No signture in this transactions!");
        }
        const publicKey = Wallet_1.EC.keyFromPublic(this.fromAddress, "hex");
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}
exports.default = Transaction;
