import express from "express";
import {informe,verInforme,verInformeMantencion,verInformeSeguro,verInformeRtecnica}from '../controllers/InformeControllers.js'
import protegerRutas from "../middleware/protegerRuta.js";


const router = express.Router()

router.get('/mi-informe', protegerRutas, informe)
router.get('/mi-informe-equipo', protegerRutas, verInforme)
router.get('/mi-informe-mantencion', protegerRutas, verInformeMantencion)
router.get('/mi-informe-seguro', protegerRutas, verInformeSeguro)
router.get('/mi-informe-rtecnica', protegerRutas, verInformeRtecnica)


export default router