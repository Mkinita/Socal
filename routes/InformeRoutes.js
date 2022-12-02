import express from "express";
import {informe,verInforme}from '../controllers/InformeControllers.js'
import protegerRutas from "../middleware/protegerRuta.js";


const router = express.Router()

router.get('/mi-informe', protegerRutas, informe)
router.get('/mi-informe-equipo', protegerRutas, verInforme)


export default router