import { privateKey } from "./../../model/Wallet/index";
import express from "express";
import MyWallet from "../../model/Wallet";
import walletModel from "../../model/Wallet/wallet.model";

const router = express.Router();

router.post("/signup", (req, res) => {
  const newWallet = new MyWallet();
  try {
    walletModel.create(
      {
        publicKey: newWallet.publicKey,
        privateKey: newWallet.privateKey,
        password: req.body.password,
      },
      (err, docs) => {
        if (docs) res.send(newWallet);
        else if (err) console.log("Error: ", err);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
  }
});

router.post("/password", (req, res) => {
  try {
    walletModel.find({ password: req.body.password }, (err, docs: any) => {
      if (docs) {
        res.send(docs[0].publicKey);
      } else if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    console.log("Error: ", error);
  }
});

router.post("/getwallet", (req, res) => {
  console.log(req.body.key.publicKey);
  if (req.body?.key.publicKey) {
    const key = req.body.key.publicKey;
    //Identify
    walletModel.find({ publicKey: key}, (err, docs: any) => {
      if (docs) {
        console.log(docs);
       if (docs?.length > 0) {
        let balance = 0;
        const value = MyWallet.wallet.map((ele) => {
          if (ele.publicKey === key) {
            balance = ele.getBalance();
            return true;
          }
          return false;
        });
        if (value.includes(true)) {
          res.send({ balance });
        } else {
          res.sendStatus(404);
        }
       }
       else res.sendStatus(403);
      } else if (err) {
        console.log(err);
      }
    });
  }
});

export default router;
