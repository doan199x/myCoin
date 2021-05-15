import CryptoJS from "crypto-js";

class Block {
  constructor(
    index,
    timestamp,
    transaction = [],
    previousHash = "",
    hash = "",
    miner = "",
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.transaction = transaction;
    this.nonce = 0;
    this.miner = miner;
    if (hash === "") this.hash = this.calculateHash();
    else this.hash = hash;
  }

  calculateHash = () => {
    return CryptoJS.SHA256(
      this.index +
      this.previousHash +
      this.timestamp + JSON.stringify(this.transaction) +
      this.nonce
    ).toString();
  };

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    return this;
  }

  hasValidTransactions() {
    for (const tx of this.transaction) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }

  static calculateHash = (
    index,
    previousHash,
    timestamp,
    nonce,
    transaction
  ) => {
    return CryptoJS.SHA256(
      index + previousHash + timestamp + JSON.stringify(transaction) + nonce
    ).toString();
  };
}

export default Block;
