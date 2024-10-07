import express from "express";


const router = express.Router();

router.get("/",(req, res) => {
    res.send('Clientes OK');
})

export default router;