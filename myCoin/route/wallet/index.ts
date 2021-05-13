import { privateKey } from "./../../model/Wallet/index";
import express from "express";
import MyWallet from "../../model/Wallet";
import walletModel from "../../model/Wallet/wallet.model";
import jwt from "jsonwebtoken";

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
      if (docs?.length) {
        res.send(docs[0].publicKey);
      } else if (err) {
        console.log(err);
        res.send(err)
      }
    });
  } catch (error) {
    console.log("Error: ", error);
  }
});

router.post("/signin", (req, res) => {
  if (req.body?.key.publicKey) {
    const key = req.body.key.publicKey;
    const password = req.body.password;
    //Identify
    walletModel.find({ publicKey: key,password:password}, (err, docs: any) => {
      if (docs) {
       if (docs?.length > 0) {
        docs[0].password = "";
        jwt.sign(
          JSON.stringify(docs[0]),
          "myCoin",
          (err,token) => {
            if (err) {
              res.sendStatus(503);
            } else {
              res.send({
                token,
                publicKey: docs[0].publicKey,
              });
            }
          }
        );
       }
       else res.sendStatus(403);
      } else if (err) {
        console.log(err);
      }
    });
  }
});

export default router;
