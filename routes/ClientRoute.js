import express from "express";
import { success } from "../helpers/answersApi.js";

import poolDb from "../config/db.js";

console.log(poolDb);

const router = express.Router();


router.get("/",(req, res) => {
    success(req,res, 'Todo OK desde clientes', 200);
})

export default router;