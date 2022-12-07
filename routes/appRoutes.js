import express  from "express";
import {inicio, 
        categoria, 
        faena,
        noEncontrado, 
        buscador} 
from '../controllers/appControllers.js'
import protegerRutas from "../middleware/protegerRuta.js";

const router = express.Router()



//Pagina de inicio
router.get('/inicio',inicio)


//Categorias
router.get('/categorias/:id', categoria)

//Faenas
router.get('/faenas/:id', protegerRutas,faena)

//Pagina 404
router.get('/404',noEncontrado)


//Buscador
router.post('/buscador',buscador)


export default router