import express from "express";
import DigimonController from "../controllers/digimon.controller.js";
const router = express.Router();

//rutas frontend
router.get('/', DigimonController.indexDigimons)

router.get("/about", DigimonController.aboutUs)

router.get("/search", DigimonController.searchDigimonsV2)

// Ruta dinámica debe ir después de las rutas específicas
router.get('/:id(\\d+)', DigimonController.singleDigimon)

// Manejador 404 al final
router.all("*", (req, res) => {
    res.status(404).render("digimon/404", {
        layout: "digimon",
        title: "404 - Page Not Found"
    });
});



export default router;