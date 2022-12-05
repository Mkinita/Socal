import express from "express";
import { body } from 'express-validator'
import {principal,admin,crear, guardar,eliminar,enviarMensaje,verMensajes,mostrarPropiedad}from '../controllers/ChatControllers.js'
import protegerRutas from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";


const router = express.Router()

router.get('/mi-chat', protegerRutas, principal)

router.get('/mi-chat', protegerRutas, admin)
router.get('/chats/crear', protegerRutas,crear)
router.post('/chats/crear', protegerRutas,
    // body('titulo').notEmpty().withMessage('El titulo es Obligatorio'),
    // body('descripcion').notEmpty().withMessage('La Descripcion es Obligatoria').isLength({max: 50}).withMessage('La Descripcion es muy Larga'),
    // body('categoria').isLength({min: 1}).withMessage('Seleciona una Categoria'),
    guardar

)

 router.post('/chats/eliminar/:id',protegerRutas,eliminar)

router.get('/chat/:id',identificarUsuario,mostrarPropiedad)

//almecenar los mensajes
router.post('/chat/:id',
identificarUsuario,
body('mensaje').isLength({min:5}).withMessage('No Puede ir vacio o es muy corto'),
enviarMensaje)


router.get('/chat/:id', protegerRutas,verMensajes)



export default router