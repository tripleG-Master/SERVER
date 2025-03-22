import express from "express";
import PokemonController from "../controllers/pokemon/pokemon.controller.js"

const router = express.Router();

//rutas frontend
//router.get('/', (req,res) => res.send({message:"haha"}))
router.get('/', PokemonController.index)

export default router;