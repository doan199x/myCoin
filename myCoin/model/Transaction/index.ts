import SHA256 from "crypto-js/sha256";
import { EC } from "../Wallet";

class Transaction {
  fromAddress: string;
  toAddress: string;
  amount: number;
  signature: any;
  constructor(fromAddress: string, toAddress: string, amount: number) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransactions(signingKey: any) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You can not sign transactions for other wallets!");
    }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signture in this transactions!");
    }

    const publicKey = EC.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

export default Transaction;
