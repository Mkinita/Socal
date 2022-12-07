import express from "express";
import { body } from 'express-validator'
import {admin,crear, guardar, agregarImagen,almacenarImagen, editar, guardarCambios,eliminar,alerta,buscador,mostrarPropiedad,enviarMensaje,verMensajes,principal}from '../controllers/EquiposControllers.js'
import protegerRutas from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router()

router.get('/mi-panel', protegerRutas, principal)

router.get('/mis-equipos', protegerRutas, admin)
router.get('/equipos/crear-equipo', protegerRutas,crear)
router.post('/equipos/crear-equipo', protegerRutas,
    body('titulo').notEmpty().withMessage('El titulo es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 50}).withMessage('La Descripcion es muy Larga'),
    body('categoria').isLength({min: 1}).withMessage('Seleciona una Categoria'),
    guardar

)



router.get('/equipos/agregar-imagen-socal/:id',protegerRutas,agregarImagen)

router.post('/equipos/agregar-imagen-socal/:id',protegerRutas,
upload.single('imagen'),almacenarImagen
)

router.get('/equipos/editar/:id',protegerRutas,editar)


router.post('/equipos/editar/:id', protegerRutas,
    body('titulo').notEmpty().withMessage('El titulo es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 50}).withMessage('La Descripcion es muy Larga'),
    body('categoria').isLength({min: 1}).withMessage('Seleciona una Categoria'),
    guardarCambios

)

 router.post('/equipos/eliminar/:id',protegerRutas,eliminar)
 router.get('/alerta/eliminar/:id', protegerRutas, alerta)


 router.post('/equipos/buscador-admin',protegerRutas,buscador)


//  area publica
router.get('/equipo/:id',identificarUsuario,mostrarPropiedad)



//almecenar los mensajes
router.post('/equipo/:id',
identificarUsuario,
body('mensaje').isLength({min:5}).withMessage('No Puede ir vacio o es muy corto'),
enviarMensaje)


router.get('/mensaje/:id', protegerRutas,verMensajes)



export default router
