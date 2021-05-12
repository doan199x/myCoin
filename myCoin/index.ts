import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import TYPE from "./constant";
import routesMdw from "./middleware/route.mdw";
import BlockChain from "./model/BlockChain/index";
import Transaction from "./model/Transaction";
import MyWallet, { EC } from "./model/Wallet";
import Block from "./model/Block/index";

// rest of the code remains same
const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

/*  -Configurations & server-  */
const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Key
const connect_URL =
  "mongodb+srv://admin:admin@cluster0.mbewg.mongodb.net/myCoin?retryWrites=true&w=majority";

mongoose.connect(connect_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.once("open", () => {
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
const minerBlock: any = [];

io.on("connection", (socket) => {
  socket.on(TYPE.LOGIN, () => {
    connectCounter++;
    io.to(`${socket.id}`).emit(TYPE.LAST_BLOCK, {
      block: BlockChain.instance.chain[BlockChain.instance.chain.length - 1],
      difficulty: BlockChain.instance.difficulty,
      pendingTransactions: BlockChain.instance.pendingTransactions,
    });
  });
  socket.on("disconnect", () => connectCounter--);
  socket.on(TYPE.MINED, ({ block, minerAddress}) => {
    try {
      const newBlock = new Block(
        block.index,
        block.timestamp,
        block.transaction,
        block.previousHash,
        block.hash,
        block.nonce
      );
      minerBlock.push({ block: newBlock, minerAddress, vote: 0 });
      socket.broadcast.emit(TYPE.MINING_A_BLOCK, block);
    } catch (error) {}
  });

  socket.on(TYPE.GET_BALANCE, ({ key }, callback) => {
    let balance = 0;
    const value = MyWallet.wallet.map((ele) => {
      if (ele.publicKey === key.publicKey) {
        balance = ele.getBalance();
        return true;
      }
      return false;
    });
    if (value.includes(true)) {
      callback({ balance });
    } else {
      callback({ balance: -1 });
    }
  });

  socket.on(TYPE.VOTE_NEW_BLOCK, ({ block, vote }) => {
    const result = minerBlock.findIndex((ele) => {
      return (
        ele.block.index === block.index &&
        ele.block.previousHash === block.previousHash &&
        ele.block.timestamp === block.timestamp &&
        ele.block.hash === block.hash
      );
    });
    if (result >= 0 && vote) {
      minerBlock[result].vote++;
      if (
        connectCounter === 1 ||
        minerBlock[result].vote > connectCounter / 3
      ) {
        const validAdd = BlockChain.instance.addBlock(minerBlock[result].block);
        if (validAdd) {
          const transaction = new Transaction(
            "",
            minerBlock[result].minerAddress,
            BlockChain.instance.miningReward
          );
          minerBlock.splice(result, 1);
          BlockChain.instance.removePendingTransaction();
          io.emit(TYPE.LAST_BLOCK, {
            block,
            difficulty: BlockChain.instance.difficulty,
            pendingTransactions: BlockChain.instance.pendingTransactions,
          });
          BlockChain.instance.addTransaction(transaction);
          io.emit(TYPE.NEW_TRANSACTION, transaction);
        }
      }
    }
  });

  socket.on(TYPE.SEND_TRANSACTION, (params, callback) => {
    if (
      !params.publicKey ||
      MyWallet.getBalance(params.publicKey) < params.amount
    ) {
      return callback("Invalid amount");
    }
    try {
      const transaction = new Transaction(
        params.publicKey,
        params.payeePublicKey,
        params.amount
      );
      const yourKey = EC.keyFromPrivate(params.privateKey);
      transaction.signTransactions(yourKey);
      BlockChain.instance.addTransaction(transaction);
      io.emit(TYPE.NEW_TRANSACTION, transaction);
    } catch (error) {
    }
  });
});

app.get("/", (req, res) => res.send(JSON.stringify("Typescript")));

routesMdw(app);
