import express from "express";
import { body } from 'express-validator'
import {admin,crear, guardar, editar, guardarCambios,eliminar}from '../controllers/UbicacionControllers.js'
import protegerRutas from "../middleware/protegerRuta.js";


const router = express.Router()



router.get('/mis-ubicaciones', protegerRutas, admin)
router.get('/ubicaciones/crear-ubicacion', protegerRutas,crear)
router.post('/ubicaciones/crear-ubicacion', protegerRutas,
    body('nombre').notEmpty().withMessage('El titulo es Obligatorio'),
    guardar

)



router.get('/ubicaciones/editar/:id',protegerRutas,editar)


router.post('/ubicaciones/editar/:id', protegerRutas,
    body('nombre').notEmpty().withMessage('El titulo es Obligatorio'),
    guardarCambios

)

 router.post('/ubicaciones/eliminar/:id',protegerRutas,eliminar)







export default router