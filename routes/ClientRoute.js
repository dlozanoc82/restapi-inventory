import express from "express";
import { success } from "../helpers/answersApi.js";



const router = express.Router();


router.get("/",(req, res) => {
    success(req,res, 'Todo OK desde clientes', 200);
})

export default router;