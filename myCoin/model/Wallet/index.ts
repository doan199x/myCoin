/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import elliptic from "elliptic";
import Transaction from "./../Transaction/index";
import BlockChain from "../BlockChain";
export const ec = elliptic.ec;
export const EC = new ec("secp256k1");

export const key = EC.genKeyPair();
export const publicKey = key.getPublic("hex");
export const privateKey = key.getPrivate("hex");

export default class MyWallet {
  public publicKey: string;
  public privateKey: string;
  public static wallet: MyWallet[] = [];
  constructor() {
    const keyGenerate = EC.genKeyPair();
    this.publicKey = keyGenerate.getPublic("hex");
    this.privateKey = keyGenerate.getPrivate("hex");
    MyWallet.wallet.push(this);
  }

  sendMoney(amount: number, payeePublicKey: string) {
    const transaction = new Transaction(this.publicKey, payeePublicKey, amount);
    transaction.signTransactions(this.privateKey);
    BlockChain.instance.addTransaction(transaction);
  }

  getHistory() {
    return BlockChain.instance.getUserHistory(this.publicKey);
  }

  getAllHistory() {
    return BlockChain.instance.getAllUsersHistory();
  }

  getBalance() {
    return BlockChain.instance.getBalanceOfAddress(this.publicKey);
  }

  public static getBalance(publicKey) {
    const result = MyWallet.wallet.findIndex(
      (ele) => ele.publicKey === publicKey
    );
    if (result >= 0) {
      return BlockChain.instance.getBalanceOfAddress(publicKey);
    } else return -1;
  }
}
