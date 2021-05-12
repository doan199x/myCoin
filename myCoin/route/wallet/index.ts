import { privateKey } from "./../../model/Wallet/index";
import express from "express";
import MyWallet from "../../model/Wallet";
import walletModel from "../../model/Wallet/wallet.model";

const router = express.Router();

router.post("/signup", (req, res) => {
  const newWalelt = new MyWallet();
  try {
    walletModel.create(
      {
        publicKey: req.body.publicKey,
        privateKey: req.body.privateKey,
        password: req.body.password,
      },
      (err, docs) => {
        if (docs) console.log(docs);
        else if (err) console.log(err);
      }
    );
  } catch (error) {
    console.log(error);
  }
  res.send(newWalelt);
});

router.post("/getwallet", (req, res) => {
  if (req.body?.key) {
    const key = req.body.key;
    let balance = 0;
    const value = MyWallet.wallet.map((ele) => {
      if (ele.publicKey === key.publicKey) {
        balance = ele.getBalance();
        return true;
      }
      return false;
    });
    if (value.includes(true)) {
      res.send({ balance });
    } else res.sendStatus(404);
  }
});

export default router;
