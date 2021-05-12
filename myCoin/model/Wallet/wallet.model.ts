import mongoose, { Document, Schema } from "mongoose";

export interface IWallet extends Document {
  publicKey: string;
  privateKey: string;
  password: string;
}

const instance = new mongoose.Schema({
    publicKey: String,
    privateKey: String,
    password: String,
});

export default mongoose.model<IWallet>("Wallet", instance);