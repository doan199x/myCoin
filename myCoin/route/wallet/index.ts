import express from "express";
import MyWallet from "../../model/Wallet";

const router = express.Router();

router.post("/", (req, res) => {
  const newWalelt = new MyWallet();
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
