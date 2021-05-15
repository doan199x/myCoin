"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Block_1 = __importDefault(require("../Block"));
const Transaction_1 = __importDefault(require("./../Transaction"));
class BlockChain {
    constructor() {
        this.getGenesisBlock = () => {
            return new Block_1.default(0, new Date().getTime() / 1000, [], "0");
        };
        this.getLastestBlock = () => {
            return this.chain[this.chain.length - 1];
        };
        this.generateNextBlock = (blockData) => {
            const previousBlock = this.getLastestBlock();
            const nextIndex = previousBlock.index + 1;
            const nextTimestamp = new Date().getTime() / 1000;
            const nextHash = Block_1.default.calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData.transaction, this.difficulty);
            return new Block_1.default(nextIndex, nextTimestamp, this.pendingTransactions, previousBlock.hash, nextHash);
        };
        this.addBlock = (newBlock) => {
            // newBlock.previousHash = this.getLastestBlock().hash;
            // newBlock.hash = newBlock.calculateHash();
            // newBlock.mineBlock(this.difficulty);
            const valid = this.isValidNewBlock(newBlock, this.chain[this.chain.length - 1]);
            if (valid) {
                console.log("NEW BLOCK: ", newBlock.hash, newBlock.index, newBlock.transaction.length);
                this.chain.push(newBlock);
                this.removePendingTransactionBlock(newBlock);
            }
            return valid;
        };
        this.isValidNewBlock = (newBlock, previousBlock) => {
            if (previousBlock.index + 1 !== newBlock.index) {
                //console.log("INVALID INDEX");
                return false;
            }
            else if (previousBlock.hash !== newBlock.previousHash) {
                //console.log("INVALID PREVIOUSHASH");
                return false;
            }
            else if (newBlock.calculateHash() !== newBlock.hash) {
                // console.log("INVALID HASH");
                return false;
            }
            else if (newBlock.index !== 0 && newBlock.transaction.length === 0) {
                return false;
            }
            else if (!this.isValidTransaction(newBlock.transaction)) {
                // console.log("INVALID transaction");
                return false;
            }
            return true;
        };
        this.isValidChain = (blockchainToValiddate = this) => {
            if (JSON.stringify(blockchainToValiddate.chain[0]) ==
                JSON.stringify(this.getGenesisBlock())) {
                return false;
            }
            const tempBlocks = [blockchainToValiddate.chain[0]];
            for (let i = 1; i < blockchainToValiddate.chain.length; i++) {
                if (!blockchainToValiddate.chain[i].hasValidTransactions()) {
                    return false;
                }
                if (this.isValidNewBlock(blockchainToValiddate.chain[i], tempBlocks[i - 1])) {
                    tempBlocks.push(blockchainToValiddate[i]);
                }
                else
                    return false;
            }
            return true;
        };
        this.replaceChain = (newBlockChains) => {
            if (this.isValidChain(newBlockChains) &&
                newBlockChains.chain.length > this.chain.length) {
                console.log("RECEIVED BLOCKCHAIN IS VALID");
                this.chain = newBlockChains.chain;
                // need to boardcast here
                // boardcast(responseLatestMag());
            }
            else {
                console.log("Recived blockchain invalid");
            }
        };
        this.difficulty = 4;
        this.miningReward = 10;
        this.pendingTransactions = [];
        this.chain = [this.getGenesisBlock()];
    }
    removePendingTransactionBlock(newBlock) {
        this.pendingTransactions.splice(0, newBlock.transaction.length);
    }
    removePendingTransaction() {
        this.pendingTransactions.splice(0, this.chain[this.chain.length - 1].transaction.length);
    }
    minePendingTransactions(miningRewardAddress) {
        const index = this.chain[this.chain.length - 1].index + 1;
        const block = new Block_1.default(index, Date.now(), this.pendingTransactions, this.chain[this.chain.length - 1].hash);
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction_1.default(null, miningRewardAddress, this.miningReward),
        ];
    }
    addTransaction(transaction) {
        if (!transaction.toAddress) {
            throw new Error("Transaction must include from address and to address");
        }
        if (!transaction.isValid()) {
            throw new Error("Can not add invalid transaction to chain");
        }
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address) {
        let balance = 10;
        for (const block of this.chain) {
            for (const trans of block.transaction) {
                if (trans.fromAddress === address) {
                    balance -= +trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += +trans.amount;
                }
            }
        }
        return balance;
    }
    getUserHistory(address) {
        const history = [];
        for (const block of this.chain) {
            for (const trans of block.transaction) {
                if (trans.fromAddress === address || trans.toAddress === address) {
                    history.push(trans);
                }
            }
        }
        return history;
    }
    getAllUsersHistory() {
        const history = [];
        for (const block of this.chain) {
            for (const trans of block.transaction) {
                history.push(trans);
            }
        }
        return history;
    }
    isValidTransaction(transaction) {
        if (transaction.length - 1 > this.pendingTransactions.length) {
            return false;
        }
        let reward = 0;
        for (let i = 0; i < transaction.length; i++) {
            if (transaction[i].fromAddress === null) {
                if (transaction[i].amount !== BlockChain.instance.miningReward) {
                    return false;
                }
                reward++;
            }
            if (reward > 1) {
                return false;
            }
        }
        return true;
    }
}
BlockChain.instance = new BlockChain();
exports.default = BlockChain;
