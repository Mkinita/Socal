import express from "express";
import { body } from 'express-validator'
import {admin,crearMantencion,guardarMantencion,editar,guardarCambios,eliminar,buscador
    //,mostrarPropiedad,enviarMensaje,verMensajes
}from '../controllers/MantencionControllers.js'
import protegerRutas from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router()

router.get('/mis-mantenciones', protegerRutas, admin)
router.get('/mantenciones/crear-mantencion', protegerRutas,crearMantencion)
router.post('/mantenciones/crear-mantencion', protegerRutas,
    body('fechainicio').notEmpty().withMessage('la Fecha es Obligatoria'),
    // body('fechaifin').notEmpty().withMessage('la Fecha es Obligatoria'),
    body('kilometraje').notEmpty().withMessage('El Kilometraje Obligatoria'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 200}).withMessage('La Descripcion es muy Larga'),
    body('equipo').isLength({min: 1}).withMessage('Seleciona una Equipo'),
    guardarMantencion

)



router.get('/mantenciones/editar/:id',protegerRutas,editar)


router.post('/mantenciones/editar/:id', protegerRutas,
    body('fechainicio').notEmpty().withMessage('la Fecha es Obligatoria'),
    // body('fechaifin').notEmpty().withMessage('la Fecha es Obligatoria'),
    body('kilometraje').notEmpty().withMessage('El Kilometraje Obligatoria'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 200}).withMessage('La Descripcion es muy Larga'),
    body('equipo').isLength({min: 1}).withMessage('Seleciona una Equipo'),
    guardarCambios

)

 router.post('/mantenciones/eliminar/:id',protegerRutas,eliminar)


router.post('/mantenciones/buscador-mantencion',protegerRutas,buscador)






export default router