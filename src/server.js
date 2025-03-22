import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { create } from 'express-handlebars';
import { exec } from 'child_process';

//RUTAS
import digimonRoute from './routes/digimon.route.js';

//CONFIGURACION INICIAL DE LOS ELEMENTOS
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hbs = create({
    extname: '.handlebars',
    partialsDir: path.join(__dirname, 'views/partials'),
});

//HELPERS HANDLEBARS
hbs.handlebars.registerHelper('eq', function (a, b) { 
    return a === b;
});

//CONFIGURACION DE EXPRESS
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("short"));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"))


//MIDDLEWARE QUE SIMULA DELAY EN LAS PETICIONES
const delayMiddleware = (req, res, next) => {
    const delay = Math.floor(Math.random() * 100) + 300;
    setTimeout(next, delay);
};
app.use(delayMiddleware);

//ARCHIVOS ESTATICOS
app.use(express.static('public'));

//APLICAMOS LAS RUTAS
app.use('/digimon', digimonRoute);


//INICIALIZAMOS EL SERVIDOR
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});