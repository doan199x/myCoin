"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const crypto_js_1 = __importDefault(require("crypto-js"));
class Block {
    constructor(index, timestamp, transaction, previousHash = "", hash = "", nonce = 0) {
        this.calculateHash = () => {
            return crypto_js_1.default.SHA256(this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.transaction) +
                this.nonce).toString();
        };
        this.index = index;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.transaction = transaction;
        this.nonce = nonce;
        if (hash === "")
            this.hash = this.calculateHash();
        else
            this.hash = hash;
    }
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("New block: " + this.hash);
    }
    hasValidTransactions() {
        for (const tx of this.transaction) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
}
Block.calculateHash = (index, previousHash, timestamp, transaction, nonce) => {
    return crypto_js_1.default.SHA256(index + previousHash + timestamp + JSON.stringify(transaction) + nonce).toString();
};
exports.default = Block;
