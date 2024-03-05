import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRouters from "./routes/web";
import initApiRouters from "./routes/api";
import bodyParser from "body-parser";
import connection from "./config/connectDB"
import configCors from "./config/cors"
import { configPassport } from "./controller/passportController"
import configSession from "./config/session";
//import cors from 'cors';
import { createJWT, verifytoken } from "./middleware/jwtAction";
import cookieParser from 'cookie-parser'
import flash from 'connect-flash';
import configLoginWithGoogle from "./controller/googleControler";
require("dotenv").config();
const app = express();
//app.use(cors({ origin: true }));
configCors(app);

//config view engine
configViewEngine(app);


//test token


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cookieParser())
configSession(app);

//init web router
initWebRouters(app);

//init api router
initApiRouters(app);

configPassport();
configLoginWithGoogle();
//test connection
connection();


const PORT = process.env.PORT || 8086;
app.listen(PORT, () => {
    console.log(">>> Backend is running on the port = ", PORT);

})


