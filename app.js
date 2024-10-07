import express from "express";
import { config } from "./config/config.js";
import ClientRoute from "./routes/ClientRoute.js"

const app = express();

//Configuracion del Puerto
app.set('port', config.app.port);


//Rutas del Backend
app.use("/api/clientes",ClientRoute)

export {
    app
}