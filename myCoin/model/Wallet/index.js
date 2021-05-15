"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateKey = exports.publicKey = exports.key = exports.EC = exports.ec = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const elliptic_1 = __importDefault(require("elliptic"));
const index_1 = __importDefault(require("./../Transaction/index"));
const BlockChain_1 = __importDefault(require("../BlockChain"));
exports.ec = elliptic_1.default.ec;
exports.EC = new exports.ec("secp256k1");
exports.key = exports.EC.genKeyPair();
exports.publicKey = exports.key.getPublic("hex");
exports.privateKey = exports.key.getPrivate("hex");
class MyWallet {
    constructor() {
        const keyGenerate = exports.EC.genKeyPair();
        this.publicKey = keyGenerate.getPublic("hex");
        this.privateKey = keyGenerate.getPrivate("hex");
        MyWallet.wallet.push(this);
    }
    sendMoney(amount, payeePublicKey) {
        const transaction = new index_1.default(this.publicKey, payeePublicKey, amount);
        transaction.signTransactions(this.privateKey);
        BlockChain_1.default.instance.addTransaction(transaction);
    }
    getHistory() {
        return BlockChain_1.default.instance.getUserHistory(this.publicKey);
    }
    getAllHistory() {
        return BlockChain_1.default.instance.getAllUsersHistory();
    }
    getBalance() {
        return BlockChain_1.default.instance.getBalanceOfAddress(this.publicKey);
    }
    static getBalance(publicKey) {
        const result = MyWallet.wallet.findIndex((ele) => ele.publicKey === publicKey);
        if (result >= 0) {
            return BlockChain_1.default.instance.getBalanceOfAddress(publicKey);
        }
        else
            return -1;
    }
}
exports.default = MyWallet;
MyWallet.wallet = [];
