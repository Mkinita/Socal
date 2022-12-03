import { Sequelize } from 'sequelize'
import { unlink} from 'node:fs/promises'
import { validationResult } from 'express-validator'
import{ Categoria, Mensaje, Usuario, Equipo,Faena,Seguro} from '../models/index.js'
import {esVendedor,formatiarFechaMantencion} from '../helpers/fecha.js'


const admin = async (req,res) =>{
    //LEER qUERYsTRING
    const {pagina: paginaActual} = req.query

    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-seguros?pagina=1')
    }


    try {
        const  {id} = req.usuario

        //limites para el paginador
        const limit = 5;
        const offset= ((paginaActual * limit) - limit)

        const [seguros, total] = await Promise.all([
                Seguro.findAll({
                limit,
                offset,
                where:{
                    FK_Usuario : id
                },
                include: [
                    { model: Equipo}
                ]
            }),
            Seguro.count({
                where:{
                    FK_Usuario :id
                }
            })
        ])


        res.render('auth/adminSeguro',{
            pagina:'Mis Seguros',
            seguros,
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
//formulario crear propiedad
const crear = async (req,res) =>{

    const [equipos] = await Promise.all([
        Equipo.findAll()

    ])
    res.render('auth/crear-seguro',{
        pagina:'Agregar Seguro A Un Equipo',
        barra: true,
        equipos,
        csrfToken: req.csrfToken(),
        datos:{}
    })
}



const guardar = async (req,res) =>{
    //validacion resultado

    //validacion resultado

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const [equipos] = await Promise.all([
            Equipo.findAll()
    
        ])


        return res.render('auth/crear-seguro',{
            pagina:'Mis Seguros',
            barra: true,
            equipos,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            datos: req.body,
            formatiarFechaMantencion
         })
     }

     // crear un registro
     const {numeropoliza,fechainicio,fechafin,descripcion,equipo} = req.body

     const {id: FK_Usuario} = req.usuario
     try {
        const seguroGuardado = await Seguro.create({
            numeropoliza,
            fechainicio,
            fechafin,
            descripcion,
            equipoId: equipo,
            FK_Usuario

        })


        const {id} = seguroGuardado
        res.redirect('/mis-seguros')


     

     } catch (error) {
        console.log(error)
     }



}




const editar = async (req,res) => {

    const {id} = req.params
    //validar que la propiedad exixta
    const seguro = await  Seguro.findByPk(id)

    if(!seguro){
        return res.redirect('/mis-seguros')
    }

    //validar quien revisa la url es el usuario
    if(seguro.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-seguros')
    }

    //condultar modelo de categoria y precio
     const [equipos] = await Promise.all([
        Equipo.findAll()
    ])

    res.render('auth/editarSeguro',{
        pagina:`Editar`,
        barra: true,
        csrfToken: req.csrfToken(),
        equipos,
        datos: seguro

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

        return  res.render('auth/editarSeguro',{
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
    const seguro = await  Seguro.findByPk(id)

    if(!seguro){
        return res.redirect('/mis-seguros')
    }

    //validar quien revisa la url es el usuario
    if(seguro.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-seguros')
    }


    //reescribir el objeto

    try {

        const {numeropoliza,fechainicio,fechafin,descripcion,equipo:equipoId} = req.body

        seguro.set({
        numeropoliza,
        fechainicio,
        fechafin,
        descripcion,
        equipoId
       })

       await seguro.save();
       res. redirect('/mis-seguros')

    } catch (error) {
        console.log(error)
    }
}


const eliminar = async (req, res) =>{

    //validando
    const {id} = req.params
    //validar que la propiedad exixta
    const seguro = await Seguro.findByPk(id)

    if(!seguro){
        return res.redirect('/mis-seguros')
    }

    //validar quien revisa la url es el usuario
    if(seguro.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-seguros')
    }




    //eliminando la seguro
    await seguro.destroy()
    res.redirect('/mis-seguros')
    

}


export {admin,
    crear,
    guardar,
    editar,
    guardarCambios,
    eliminar,
}