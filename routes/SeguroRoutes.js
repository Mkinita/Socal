import express from "express";
import { body } from 'express-validator'
import {admin,crear, guardar, editar, guardarCambios,eliminar}from '../controllers/SeguroControllers.js'
import protegerRutas from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router()


router.get('/mis-seguros', protegerRutas, admin)
router.get('/seguros/crear-seguro', protegerRutas,crear)
router.post('/seguros/crear-seguro', protegerRutas,
    
    body('numeropoliza').notEmpty().withMessage('El N° de Poliza es Obligatorio'),
    body('fechainicio').notEmpty().withMessage('la Fecha es Obligatoria'),
    // body('fechaifin').notEmpty().withMessage('la Fecha es Obligatoria'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 200}).withMessage('La Descripcion es muy Larga'),
    body('equipo').isLength({min: 1}).withMessage('Seleciona una Equipo'),
    guardar

)



router.get('/seguros/editar/:id',protegerRutas,editar)


router.post('/seguros/editar/:id', protegerRutas,
    body('numeropoliza').notEmpty().withMessage('El N° de Poliza es Obligatorio'),
    body('fechainicio').notEmpty().withMessage('la Fecha es Obligatoria'),
    // body('fechaifin').notEmpty().withMessage('la Fecha es Obligatoria'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 200}).withMessage('La Descripcion es muy Larga'),
    body('equipo').isLength({min: 1}).withMessage('Seleciona una Equipo'),
    guardarCambios

)

 router.post('/seguros/eliminar/:id',protegerRutas,eliminar)


//  router.post('/seguros/buscador-admin',protegerRutas,buscador)




export default router