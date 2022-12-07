import { Sequelize } from 'sequelize'
import {Precio, Categoria, Propiedad,Equipo,Faena} from '../models/index.js'

const inicio = async (req, res) => {

    const [categorias,casas] = await Promise.all([
        Categoria.findAll({raw: true}),
        Equipo.findAll({
        
             order: [
                ['id','DESC']
            ]
        })
    ])
    res.render('auth/inicio',{
        pagina: 'inicio',
        barra: true,
        categorias,
        casas,
        csrfToken: req.csrfToken(),
    })
}


const categoria = async (req, res) => {
    
    const {id} = req.params
    

    //categoria existe?
    const categoria = await Categoria.findByPk(id)
    if(!categoria){
        return res.redirect('/404')
    }

    //obtener las propiedades de la categoria
    const equipos = await Equipo.findAll({
        where:{
            FK_Categoria: id
        }
    })

    res.render('auth/categoria',{
        pagina: `${categoria.nombre}`,
        barra: true,
        equipos,
        csrfToken: req.csrfToken()
    })

}


const faena = async (req, res) => {
    
    const {id} = req.params
    

    //categoria existe?
    const faena = await Faena.findByPk(id)
    if(!faena){
        return res.redirect('/404')
    }

    //obtener las propiedades de la categoria
    const equipos = await Equipo.findAll({
        where:{
            FK_Faena: id
        },include:[
            { model:Categoria},
            {model:Faena}
        ]
    })
    

    res.render('auth/faena',{
        pagina: `${faena.nombre}`,
        barra: true,
        equipos,
        csrfToken: req.csrfToken()
    })

}

const noEncontrado  = (req, res) => {
    res.render('auth/404',{
        pagina: '404 No Encontrado',
        barra: true,
        csrToken: req.csrToken()
    })
}

const buscador = async (req, res) => {
    const {termino} = req.body
    //validar que el termino no este basio 
    if(!termino.trim){
        return res.redirect('back')
    }
    //colsultar
    const equipos = await Equipo.findAll({
        where:{
            titulo:{
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        }
    })

    res.render('auth/busqueda',{
        pagina: 'Resultado de la busqueda',
        barra: true,
        equipos,
        csrfToken: req.csrfToken()
    })

}


export {
    inicio,
    categoria,
    faena,
    noEncontrado,
    buscador
}