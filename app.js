import express from "express";
import morgan from "morgan";
import cors from "cors";

import { config } from "./config/config.js";
import AuthRoute from "./routes/AuthRoute.js";
import ClientRoute from "./routes/ClientRoute.js"
import UserRoute from "./routes/UserRoute.js"
import ProveedorRoute from "./routes/ProveedorRoute.js"
import ProductRoute from "./routes/ProductRoute.js"
import SalesRoute from "./routes/SalesRoute.js"
import CategoriesRoute from "./routes/CategoriesRoute.js";
import MeansPaymentRoute from "./routes/MeansPaymentRoute.js"
import SeparateRoute from "./routes/SeparateRoute.js"
import QuoteRoute from "./routes/QuoteRoute.js"
import ComprasRoute from "./routes/ComprasRoute.js"
import errorsMessages from "./helpers/errorsMessages.js";

const app = express();

//Configuracion de CORS
app.use('/public', express.static('public'));
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
app.use("/api/proveedores", ProveedorRoute);
app.use("/api/productos", ProductRoute);
app.use("/api", CategoriesRoute);
app.use("/api", SalesRoute);
app.use("/api/medios-de-pago", MeansPaymentRoute);
app.use("/api", SeparateRoute);
app.use("/api", QuoteRoute);
app.use("/api/compras", ComprasRoute);
app.use(errorsMessages);

export {
    app
}