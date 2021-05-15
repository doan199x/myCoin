"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const socket_io_1 = require("socket.io");
const constant_1 = __importDefault(require("./constant"));
const route_mdw_1 = __importDefault(require("./middleware/route.mdw"));
const index_1 = __importDefault(require("./model/BlockChain/index"));
const Transaction_1 = __importDefault(require("./model/Transaction"));
const Wallet_1 = __importStar(require("./model/Wallet"));
const index_2 = __importDefault(require("./model/Block/index"));
// rest of the code remains same
const app = express_1.default();
const PORT = process.env.PORT || 3001;
// middlewares
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(body_parser_1.default.json());
/*  -Configurations & server-  */
const server = app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
// Key
const connect_URL = "mongodb+srv://admin:admin@cluster0.mbewg.mongodb.net/myCoin?retryWrites=true&w=majority";
mongoose_1.default.connect(connect_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
mongoose_1.default.connection.once("open", () => {
    console.log("connected");
});
// const adminWallet = new MyWallet();
// const myBlockChain = BlockChain.instance;
// const tx1 = new Transaction("", adminWallet.publicKey, 10);
// myBlockChain.addTransaction(tx1);
// myBlockChain.minePendingTransactions(adminWallet.publicKey);
// console.log(
//   "my wallets",
//   myBlockChain.getBalanceOfAddress(adminWallet.publicKey)
// );
let connectCounter = 0;
const minerBlock = [];
io.on("connection", (socket) => {
    socket.on(constant_1.default.LOGIN, () => {
        io.to(`${socket.id}`).emit(constant_1.default.LAST_BLOCK, {
            block: index_1.default.instance.chain[index_1.default.instance.chain.length - 1],
            difficulty: index_1.default.instance.difficulty,
            pendingTransactions: index_1.default.instance.pendingTransactions,
        });
    });
    socket.on(constant_1.default.MINING_DONE_A_BLOCK, ({ block, minerAddress }) => {
        try {
            const newBlock = new index_2.default(block.index, block.timestamp, block.transaction, block.previousHash, block.hash, block.nonce);
            if (connectCounter === 1 || connectCounter === 2) {
                const validAdd = index_1.default.instance.addBlock(newBlock);
                if (validAdd) {
                    io.emit(constant_1.default.LAST_BLOCK, {
                        block,
                        difficulty: index_1.default.instance.difficulty,
                        pendingTransactions: index_1.default.instance.pendingTransactions,
                    });
                    io.emit(constant_1.default.HISTORY_BLOCKCHAIN, index_1.default.instance);
                }
            }
            else {
                minerBlock.push({ block: newBlock, minerAddress, vote: 0 });
                socket.broadcast.emit(constant_1.default.MINING_ABLOCK, block);
            }
        }
        catch (error) { }
    });
    // Listen client get the blockchain
    socket.on(constant_1.default.GET_BLOCKCHAIN, (callback) => {
        callback(index_1.default.instance);
    });
    socket.on(constant_1.default.GET_BALANCE, ({ key }, callback) => {
        let balance = 0;
        const value = Wallet_1.default.wallet.map((ele) => {
            if (ele.publicKey === key.publicKey) {
                balance = ele.getBalance();
                return true;
            }
            return false;
        });
        if (value.includes(true)) {
            callback({ balance });
        }
        else {
            callback({ balance: -1 });
        }
    });
    socket.on(constant_1.default.START_MINING, (callback) => {
        connectCounter++;
        callback(index_1.default.instance.pendingTransactions, index_1.default.instance.getLastestBlock());
    });
    socket.on(constant_1.default.STOP_MINING, () => {
        connectCounter--;
    });
    socket.on(constant_1.default.VOTE_NEW_BLOCK, ({ block, vote }) => {
        const result = minerBlock.findIndex((ele) => {
            return (ele.block.index === block.index &&
                ele.block.previousHash === block.previousHash &&
                ele.block.timestamp === block.timestamp &&
                ele.block.hash === block.hash);
        });
        if (result >= 0 && vote) {
            minerBlock[result].vote++;
            if (minerBlock[result].vote >= connectCounter / 2) {
                const validAdd = index_1.default.instance.addBlock(minerBlock[result].block);
                if (validAdd) {
                    minerBlock.splice(result, 1);
                    io.emit(constant_1.default.LAST_BLOCK, {
                        block,
                        difficulty: index_1.default.instance.difficulty,
                        pendingTransactions: index_1.default.instance.pendingTransactions,
                    });
                    io.emit(constant_1.default.HISTORY_BLOCKCHAIN, index_1.default.instance);
                }
            }
        }
    });
    socket.on(constant_1.default.SEND_TRANSACTION, (params, callback) => {
        if (!params.publicKey ||
            Wallet_1.default.getBalance(params.publicKey) < params.amount) {
            return io.to(`${socket.id}`).emit(constant_1.default.LISTENING_SEND_TRANSACTION, false);
        }
        try {
            const transaction = new Transaction_1.default(params.publicKey, params.payeePublicKey, params.amount);
            const yourKey = Wallet_1.EC.keyFromPrivate(params.privateKey);
            transaction.signTransactions(yourKey);
            index_1.default.instance.addTransaction(transaction);
            io.emit(constant_1.default.NEW_TRANSACTION, transaction);
            io.to(`${socket.id}`).emit(constant_1.default.LISTENING_SEND_TRANSACTION, true);
        }
        catch (error) {
            io.to(`${socket.id}`).emit(constant_1.default.LISTENING_SEND_TRANSACTION, false);
        }
    });
});
app.get("/", (req, res) => res.send("WELCOME"));
route_mdw_1.default(app);
