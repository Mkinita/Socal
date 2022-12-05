import { Sequelize } from 'sequelize'
import { unlink} from 'node:fs/promises'
import { validationResult } from 'express-validator'
import{ Categoria, Mensaje, Usuario, Equipo,Faena, Mantencion} from '../models/index.js'
import {esVendedor,formatiarFechaMantencion} from '../helpers/fecha.js'


const admin = async (req,res) =>{
    //LEER qUERYsTRING
    const {pagina: paginaActual} = req.query

    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-mantenciones?pagina=1')
    }


    try {
        const  {id} = req.usuario

        //limites para el paginador
        const limit = 5;
        const offset= ((paginaActual * limit) - limit)

        const [mantenciones, total] = await Promise.all([
                Mantencion.findAll({
                limit,
                offset,
                where:{
                    FK_Usuario : id
                },
                include: [
                    { model: Equipo}
                ]
            }),
            Mantencion.count({
                where:{
                    FK_Usuario :id
                }
            })
        ])


        res.render('auth/adminMantencion',{
            pagina:'Mis Equipos',
            mantenciones,
            barra: true,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit,
            formatiarFechaMantencion
        })
    } catch (error) {
        console.log(error)
    }


}

const crearMantencion = async (req,res) =>{

    const [equipos] = await Promise.all([
        Equipo.findAll()

    ])
    res.render('auth/crear-mantencion',{
        pagina:'Crear mantenciones',
        barra: true,
        equipos,
        csrfToken: req.csrfToken(),
        datos:{}
    })
}



const guardarMantencion = async (req,res) =>{
    //validacion resultado

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const [equipos] = await Promise.all([
            Equipo.findAll()
    
        ])


        return res.render('auth/crear-mantencion',{
            pagina:'Mis mantenciones',
            barra: true,
            equipos,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            datos: req.body,
            formatiarFechaMantencion
         })
     }

     // crear un registro
     const {patente,fechainicio,fechafin,kilometraje,descripcion,equipo} = req.body

     const {id: FK_Usuario} = req.usuario
     try {
        const mantencionGuardado = await Mantencion.create({
            patente,
            fechainicio,
            fechafin,
            kilometraje,
            descripcion,
            equipoId: equipo,
            FK_Usuario

        })


        const {id} = mantencionGuardado
        res.redirect('/mis-mantenciones')


     

     } catch (error) {
        console.log(error)
     }


}


const editar = async (req,res) => {

    const {id} = req.params
    //validar que la propiedad exixta
    const mantencion = await  Mantencion.findByPk(id)

    if(!mantencion){
        return res.redirect('/mis-mantenciones')
    }

    //validar quien revisa la url es el usuario
    if(mantencion.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-mantenciones')
    }

    //condultar modelo de categoria y precio
     const [equipos] = await Promise.all([
        Equipo.findAll()
    ])

    res.render('auth/editarMantencion',{
        pagina:`Editar`,
        barra: true,
        csrfToken: req.csrfToken(),
        equipos,
        datos: mantencion
    })
}

const guardarCambios = async (req,res) => {

    //verificar identificacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

    //condultar modelo de categoria y precio
    const [equipos] = await Promise.all([
        Equipo.findAll()
    ])

        return  res.render('auth/editarMantencion',{
            pagina:'Editar',
            barra: true,
            csrfToken: req.csrfToken(),
            equipos,
            errores: resultado.array(),
            datos: req.body
        })
    }


    const {id} = req.params
    //validar que la propiedad exixta
    const mantencion = await  Mantencion.findByPk(id)

    if(!mantencion){
        return res.redirect('/mis-mantenciones')
    }

    //validar quien revisa la url es el usuario
    if(mantencion.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-mantenciones')
    }


    //reescribir el objeto

    try {

        const {patente,fechainicio,fechafin,kilometraje,descripcion,equipo:equipoId} = req.body

        mantencion.set({
        patente,
        fechainicio,
        fechafin,
        kilometraje,
        descripcion,
        equipoId
       })

       await mantencion.save();
       res. redirect('/mis-mantenciones')

    } catch (error) {
        console.log(error)
    }
}


const eliminar = async (req, res) =>{

    //validando
    const {id} = req.params
    //validar que la propiedad exixta
    const mantencion = await Mantencion.findByPk(id)

    if(!mantencion){
        return res.redirect('/mis-mantenciones')
    }

    //validar quien revisa la url es el usuario
    if(mantencion.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-mantenciones')
    }

    


    //eliminando la mantencion
    await mantencion.destroy()
    res.redirect('/mis-mantenciones')
    

}


const buscador = async (req, res) => {
    const {termino} = req.body
    //validar que el termino no este basio 
    if(!termino.trim){
        return res.redirect('back')
    }
    //colsultar
    
    const mantenciones = await Mantencion.findAll({
        where:{
            patente:{
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },include:[
            {model:Equipo}
        ]
        
    })

    res.render('auth/buscarMantencion',{
        pagina: 'Resultado de la busqueda',
        barra: true,
        mantenciones,
        csrfToken: req.csrfToken(),
        formatiarFechaMantencion
    })

}


export {
    admin,
    crearMantencion,
    guardarMantencion,
    editar,
    guardarCambios,
    eliminar,
    buscador,
    // enviarMensaje,
    // verMensajes
}