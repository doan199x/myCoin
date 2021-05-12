/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Block from "../Block";
import Transaction from "./../Transaction";

class BlockChain {
  chain: Block[];
  difficulty: number;
  pendingTransactions: Transaction[];
  miningReward: number;
  public static instance = new BlockChain();
  constructor() {
    this.difficulty = 3;
    this.miningReward = 10;
    this.pendingTransactions = [];
    this.chain = [this.getGenesisBlock()];
  }

  getGenesisBlock = () => {
    return new Block(0, new Date().getTime() / 1000, [], "0");
  };

  getLastestBlock = () => {
    return this.chain[this.chain.length - 1];
  };

  generateNextBlock = (blockData: Block) => {
    const previousBlock = this.getLastestBlock();
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = new Date().getTime() / 1000;
    const nextHash = Block.calculateHash(
      nextIndex,
      previousBlock.hash,
      nextTimestamp,
      blockData.transaction,
      this.difficulty
    );
    return new Block(
      nextIndex,
      nextTimestamp,
      this.pendingTransactions,
      previousBlock.hash,
      nextHash
    );
  };

  addBlock = (newBlock: Block) => {
    // newBlock.previousHash = this.getLastestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    // newBlock.mineBlock(this.difficulty);
    const valid = this.isValidNewBlock(
      newBlock,
      this.chain[this.chain.length - 1]
    );
    if (valid) {
      console.log(
        "NEW BLOCK: ",
        newBlock.hash,
        newBlock.index,
        newBlock.transaction.length
      );
      this.chain.push(newBlock);
    }

    return valid;
  };

  removePendingTransaction() {
    this.pendingTransactions.splice(
      0,
      this.chain[this.chain.length - 1].transaction.length
    );
  }

  minePendingTransactions(miningRewardAddress: any) {
    const index = this.chain[this.chain.length - 1].index + 1;
    const block = new Block(
      index,
      Date.now(),
      this.pendingTransactions,
      this.chain[this.chain.length - 1].hash
    );
    block.mineBlock(this.difficulty);

    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction("", miningRewardAddress, this.miningReward),
    ];
  }

  addTransaction(transaction: Transaction) {
    if (!transaction.toAddress) {
      throw new Error("Transaction must include from address and to address");
    }

    if (!transaction.isValid()) {
      throw new Error("Can not add invalid transaction to chain");
    }

    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address: any) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transaction) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  getUserHistory(address) {
    const history:Transaction[] = [];

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
    const history:Transaction[] = [];

    for (const block of this.chain) {
      for (const trans of block.transaction) {
       history.push(trans);
      }
    }
    return history;
  }

  isValidNewBlock = (newBlock: Block, previousBlock: Block) => {
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log("INVALID INDEX");
      return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
      console.log("INVALID PREVIOUSHASH");
      return false;
    } else if (newBlock.calculateHash() !== newBlock.hash) {
      console.log("INVALID HASH");
      return false;
    }
    return true;
  };

  isValidChain = (blockchainToValiddate: BlockChain = this) => {
    if (
      JSON.stringify(blockchainToValiddate.chain[0])! ==
      JSON.stringify(this.getGenesisBlock())
    ) {
      return false;
    }

    const tempBlocks = [blockchainToValiddate.chain[0]];
    for (let i = 1; i < blockchainToValiddate.chain.length; i++) {
      if (!blockchainToValiddate.chain[i].hasValidTransactions()) {
        return false;
      }
      if (
        this.isValidNewBlock(blockchainToValiddate.chain[i], tempBlocks[i - 1])
      ) {
        //tempBlocks.push(blockchainToValiddate[i]);
      } else return false;
    }
    return true;
  };

  replaceChain = (newBlockChains: BlockChain) => {
    if (
      this.isValidChain(newBlockChains) &&
      newBlockChains.chain.length > this.chain.length
    ) {
      console.log("RECEIVED BLOCKCHAIN IS VALID");
      this.chain = newBlockChains.chain;
      // need to boardcast here
      // boardcast(responseLatestMag());
    } else {
      console.log("Received blockchain invalid");
    }
  };
}

export default BlockChain;
