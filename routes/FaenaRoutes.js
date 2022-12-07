import express from "express";
import { body } from 'express-validator'
import {admin,crear, guardar, editar, guardarCambios,eliminar}from '../controllers/FaenaControllers.js'
import protegerRutas from "../middleware/protegerRuta.js";

const router = express.Router()



router.get('/mis-faenas', protegerRutas, admin)
router.get('/faenas/crear-faena', protegerRutas,crear)
router.post('/faenas/crear-faena', protegerRutas,
    body('nombre').notEmpty().withMessage('El titulo es Obligatorio'),
    guardar

)




router.get('/faenas/editar/:id',protegerRutas,editar)


router.post('/faenas/editar/:id', protegerRutas,
    body('nombre').notEmpty().withMessage('El titulo es Obligatorio'),
    guardarCambios

)

 router.post('/faenas/eliminar/:id',protegerRutas,eliminar)







export default router
