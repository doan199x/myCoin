import { privateKey } from "./../../model/Wallet/index";
import express from "express";
import MyWallet from "../../model/Wallet";
import walletModel from "../../model/Wallet/wallet.model";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", (req, res) => {
  const newWallet = new MyWallet();
  res.send(newWallet);
});

router.post("/password", (req, res) => {
  try {
    walletModel.find({ password: req.body.password }, (err, docs: any) => {
      if (docs?.length > 0) {
        res.send(docs[0].publicKey);
      } else {
        res.sendStatus(403)
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
        let balance = 0;
        const publicKey = key;
        const value = MyWallet.wallet.map((ele) => {
          if (ele.publicKey === publicKey) {
            balance = ele.getBalance();
            return true;
          }
          return false;
        });
        if (value.includes(true)) {
          res.send({ balance });
        } else res.sendStatus(404);
        // res.send(docs[0]);
    //   }
    //    }
    //    else res.sendStatus(403);
    // });
  }
});

export default router;
