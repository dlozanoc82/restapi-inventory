import express from "express";
import morgan from "morgan";
import { config } from "./config/config.js";
import AuthRoute from "./routes/AuthRoute.js"; 
import ClientRoute from "./routes/ClientRoute.js"
import UserRoute from "./routes/UserRoute.js"
import errorsMessages from "./helpers/errorsMessages.js";

const app = express();

//Middleware Morgan <Observar las peticiones a la API>
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Configuracion del Puerto
app.set('port', config.app.port);

//Rutas del Backend
app.use("/api/auth", AuthRoute);
app.use("/api/clientes",ClientRoute);
app.use("/api/usuarios", UserRoute)
app.use(errorsMessages);

export {
    app
}