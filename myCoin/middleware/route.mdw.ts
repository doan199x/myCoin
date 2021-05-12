import { Router } from "express-serve-static-core";
import blockChainRoute from "../route/blockchain";
import walletRoute from "../route/wallet/index";

export default function (app) {
  app.use("/blockchain", blockChainRoute);
  app.use("/wallet", walletRoute);
}
