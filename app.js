import express from "express";
import morgan from "morgan";
import cors from "cors";
import { config } from "./config/config.js";
import AuthRoute from "./routes/AuthRoute.js";
import ClientRoute from "./routes/ClientRoute.js"
import UserRoute from "./routes/UserRoute.js"
import ProveedorRoute from "./routes/ProveedorRoute.js"
import ProductRoute from "./routes/ProductRoute.js"
import errorsMessages from "./helpers/errorsMessages.js";

const app = express();

//Configuracion de CORS
console.log(config.corsOptions)
app.use(cors(config.corsOptions))

//Middleware Morgan <Observar las peticiones a la API>
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Configuracion del Puerto
app.set('port', config.app.port);

//Rutas del Backend
app.use("/api/auth", AuthRoute);
app.use("/api/clientes",ClientRoute);
app.use("/api/usuarios", UserRoute);
app.use("/api/proveedores", ProveedorRoute)
app.use("/api/productos", ProductRoute)
app.use(errorsMessages);

export {
    app
}