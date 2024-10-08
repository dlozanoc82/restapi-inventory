import express from "express";
import { success } from "../helpers/answersApi.js";
import poolDb from "../config/db.js";
import { getClientsController } from "../controllers/ClientController.js";
console.log(poolDb);

const router = express.Router();


router.get("/", async(req, res) => {
    const getClients = await getClientsController();
    success(req,res, getClients, 200);
})

export default router;