import { Router } from "express-serve-static-core";
import walletRoute from "../route/wallet/index";

export default function (app) {
  app.use("/wallet", walletRoute);
}
