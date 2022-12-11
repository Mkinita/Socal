import express from "express";
import { body } from 'express-validator'
import {admin,crearrtecnicas,guardarrtecnicas,editar,guardarCambios,eliminar,buscador}from '../controllers/RTecnicaControllers.js'
import protegerRutas from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router()

router.get('/mis-reviciones-tecnicas', protegerRutas, admin)
router.get('/rtecnicas/crear-rtecnicas', protegerRutas,crearrtecnicas)
router.post('/rtecnicas/crear-rtecnicas', protegerRutas,
    body('fechainicio').notEmpty().withMessage('la Fecha es Obligatoria'),
    // body('fechaifin').notEmpty().withMessage('la Fecha es Obligatoria'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 200}).withMessage('La Descripcion es muy Larga'),
    body('equipo').isLength({min: 1}).withMessage('Seleciona una Equipo'),
    guardarrtecnicas

)



router.get('/rtecnicas/editar/:id',protegerRutas,editar)


router.post('/rtecnicas/editar/:id', protegerRutas,
    body('fechainicio').notEmpty().withMessage('la Fecha es Obligatoria'),
    // body('fechaifin').notEmpty().withMessage('la Fecha es Obligatoria'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 200}).withMessage('La Descripcion es muy Larga'),
    body('equipo').isLength({min: 1}).withMessage('Seleciona una Equipo'),
    guardarCambios

)

 router.post('/rtecnicas/eliminar/:id',protegerRutas,eliminar)


router.post('/rtecnicas/buscador-rtecnicas',protegerRutas,buscador)









export default router