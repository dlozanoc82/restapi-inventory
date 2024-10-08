import express from "express";
import morgan from "morgan";
import { config } from "./config/config.js";
import ClientRoute from "./routes/ClientRoute.js"

const app = express();

//Middleware Morgan <Observar las peticiones a la API>
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Configuracion del Puerto
app.set('port', config.app.port);

//Rutas del Backend
app.use("/api/clientes",ClientRoute)

export {
    app
}