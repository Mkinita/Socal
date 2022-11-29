import express from "express";
import { body } from 'express-validator'
import {admin,crear, guardar, agregarImagen,almacenarImagen, editar, guardarCambios, eliminar,mostrarPropiedad, enviarMensaje,verMensaje}from '../controllers/PropiedadesControllers.js'
import protegerRutas from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";


const router = express.Router()


router.get('/mis-propiedades', protegerRutas, admin)
router.get('/propiedades/crear', protegerRutas,crear)
router.post('/propiedades/crear', protegerRutas,
    body('titulo').notEmpty().withMessage('El titulo del Anuncio es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 50}).withMessage('La Descripcion es muy Larga'),
    body('categoria').isLength({min: 1}).withMessage('Seleciona una Categoria'),
    body('precio').isLength({min: 1}).withMessage('Seleciona una Rango de Precio'),
    body('habitaciones').isLength({min: 1}).withMessage('Seleciona Cantidad de Habitaciones'),
    body('estacionamiento').isLength({min: 1}).withMessage('Seleciona Cantidad de Estacionamientos'),
    body('WC').isLength({min: 1}).withMessage('Seleciona Cantidad de Baños'),
    body('titulo').notEmpty().withMessage('El titulo del Anuncio es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 50}).withMessage('La Descripcion es muy Larga'),
    body('lat').notEmpty().withMessage('Ubica la Propiedad en el Mapa'),
    
    guardar

)

//bnes raices

router.get('/propiedades/agregar-imagen/:id',protegerRutas,agregarImagen)

router.post('/propiedades/agregar-imagen/:id',protegerRutas,
upload.single('imagen'),almacenarImagen
)



router.get('/propiedades/editar/:id',protegerRutas,editar)


router.post('/propiedades/editar/:id', protegerRutas,
    body('titulo').notEmpty().withMessage('El titulo del Anuncio es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 50}).withMessage('La Descripcion es muy Larga'),
    body('categoria').isLength({min: 1}).withMessage('Seleciona una Categoria'),
    body('precio').isLength({min: 1}).withMessage('Seleciona una Rango de Precio'),
    body('habitaciones').isLength({min: 1}).withMessage('Seleciona Cantidad de Habitaciones'),
    body('estacionamiento').isLength({min: 1}).withMessage('Seleciona Cantidad de Estacionamientos'),
    body('WC').isLength({min: 1}).withMessage('Seleciona Cantidad de Baños'),
    body('titulo').notEmpty().withMessage('El titulo del Anuncio es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 50}).withMessage('La Descripcion es muy Larga'),
    body('lat').notEmpty().withMessage('Ubica la Propiedad en el Mapa'),
    
    guardarCambios

)

router.post('/propiedades/eliminar/:id',protegerRutas,
eliminar)


// area publica
router.get('/propiedad/:id',identificarUsuario,mostrarPropiedad)



//almecenar los mensajes
router.post('/propiedad/:id',
identificarUsuario,
body('mensaje').isLength({min:5}).withMessage('No Puede ir vacio o es muy corto'),
enviarMensaje)


router.get('/mensaje/:id', protegerRutas,verMensaje)



export default router