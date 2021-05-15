"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Wallet_1 = __importDefault(require("../../model/Wallet"));
const wallet_model_1 = __importDefault(require("../../model/Wallet/wallet.model"));
const router = express_1.default.Router();
router.post("/signup", (req, res) => {
    const newWallet = new Wallet_1.default();
    try {
        wallet_model_1.default.create({
            publicKey: newWallet.publicKey,
            privateKey: newWallet.privateKey,
            password: req.body.password,
        }, (err, docs) => {
            if (docs)
                res.send(newWallet);
            else if (err)
                console.log("Error: ", err);
        });
    }
    catch (error) {
        console.log("Error: ", error);
    }
});
router.post("/password", (req, res) => {
    try {
        wallet_model_1.default.find({ password: req.body.password }, (err, docs) => {
            if ((docs === null || docs === void 0 ? void 0 : docs.length) > 0) {
                res.send(docs[0].publicKey);
            }
            else {
                res.sendStatus(403);
            }
        });
    }
    catch (error) {
        console.log("Error: ", error);
    }
});
router.post("/signin", (req, res) => {
    var _a;
    if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.key.publicKey) {
        const key = req.body.key.publicKey;
        const password = req.body.password;
        //Identify
        // walletModel.find({ publicKey: key,password:password}, (err, docs: any) => {
        //   if (docs) {
        //    if (docs?.length > 0) {
        let balance = 0;
        const publicKey = key;
        const value = Wallet_1.default.wallet.map((ele) => {
            if (ele.publicKey === publicKey) {
                balance = ele.getBalance();
                return true;
            }
            return false;
        });
        if (value.includes(true)) {
            res.send({ balance });
        }
        else
            res.sendStatus(404);
        // res.send(docs[0]);
        //   }
        //    }
        //    else res.sendStatus(403);
        // });
    }
});
exports.default = router;
