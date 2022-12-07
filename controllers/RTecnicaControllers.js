import { Sequelize } from 'sequelize'
import { unlink} from 'node:fs/promises'
import { validationResult } from 'express-validator'
import{ Categoria, Mensaje, Usuario, Equipo,Faena, RTecnica} from '../models/index.js'
import {esVendedor,formatiarFechaMantencion} from '../helpers/fecha.js'


const admin = async (req,res) =>{
    //LEER qUERYsTRING
    const {pagina: paginaActual} = req.query

    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-reviciones-tecnicas?pagina=1')
    }


    try {
        const  {id} = req.usuario

        //limites para el paginador
        const limit = 5;
        const offset= ((paginaActual * limit) - limit)

        const [rtecnicas, total] = await Promise.all([
                RTecnica.findAll({
                limit,
                offset,
                where:{
                    FK_Usuario : id
                },
                include: [
                    { model: Equipo}
                ]
            }),
            RTecnica.count({
                where:{
                    FK_Usuario :id
                }
            })
        ])


        res.render('auth/adminRTecnica',{
            pagina:'Mis R.T.',
            rtecnicas,
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

const crearrtecnicas = async (req,res) =>{

    const [equipos] = await Promise.all([
        Equipo.findAll()

    ])
    res.render('auth/crear-rtecnica',{
        pagina:'Agregar Revicion Tecnica',
        barra: true,
        equipos,
        csrfToken: req.csrfToken(),
        datos:{}
    })
}



const guardarrtecnicas = async (req,res) =>{
    //validacion resultado

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const [equipos] = await Promise.all([
            Equipo.findAll()
    
        ])


        return res.render('auth/crear-rtecnica',{
            pagina:'Mis R.T.',
            barra: true,
            equipos,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            datos: req.body,
            formatiarFechaMantencion
         })
     }

     // crear un registro
     const {patente,fechainicio,fechafin,descripcion,equipo} = req.body

     const {id: FK_Usuario} = req.usuario
     try {
        const rtecnicaGuardado = await RTecnica.create({
            patente,
            fechainicio,
            fechafin,
            descripcion,
            equipoId: equipo,
            FK_Usuario

        })


        const {id} = rtecnicaGuardado
        res.redirect('/mis-reviciones-tecnicas')


     

     } catch (error) {
        console.log(error)
     }


}


const editar = async (req,res) => {

    const {id} = req.params
    //validar que la propiedad exixta
    const rtecnica = await  RTecnica.findByPk(id)

    if(!rtecnica){
        return res.redirect('/mis-reviciones-tecnicas')
    }

    //validar quien revisa la url es el usuario
    if(rtecnica.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-reviciones-tecnicas')
    }

    //condultar modelo de categoria y precio
     const [equipos] = await Promise.all([
        Equipo.findAll()
    ])

    res.render('auth/editarRtecnica',{
        pagina:`Editar`,
        barra: true,
        csrfToken: req.csrfToken(),
        equipos,
        datos: rtecnica
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

        return  res.render('auth/editarRtecnica',{
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
    const rtecnica = await  RTecnica.findByPk(id)

    if(!rtecnica){
        return res.redirect('/mis-reviciones-tecnicas')
    }

    //validar quien revisa la url es el usuario
    if(rtecnica.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-reviciones-tecnicas')
    }


    //reescribir el objeto

    try {

        const {patente,fechainicio,fechafin,descripcion,equipo:equipoId} = req.body

        rtecnica.set({
        patente,
        fechainicio,
        fechafin,
        descripcion,
        equipoId
       })

       await rtecnica.save();
       res. redirect('/mis-reviciones-tecnicas')

    } catch (error) {
        console.log(error)
    }
}


const eliminar = async (req, res) =>{

    //validando
    const {id} = req.params
    //validar que la propiedad exixta
    const rtecnica = await RTecnica.findByPk(id)

    if(!rtecnica){
        return res.redirect('/mis-reviciones-tecnicas')
    }

    //validar quien revisa la url es el usuario
    if(rtecnica.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-reviciones-tecnicas')
    }

    


    //eliminando la mantencion
    await rtecnica.destroy()
    res.redirect('/mis-reviciones-tecnicas')
    

}


const buscador = async (req, res) => {
    const {termino} = req.body
    //validar que el termino no este basio 
    if(!termino.trim){
        return res.redirect('back')
    }
    //colsultar
    
    const rtecnicas = await RTecnica.findAll({
        where:{
            patente:{
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },include:[
            {model:Equipo}
        ]
        
    })

    res.render('auth/buscarRT',{
        pagina: 'Resultado de la busqueda',
        barra: true,
        rtecnicas,
        csrfToken: req.csrfToken(),
        formatiarFechaMantencion
    })

}


export {
    admin,
    crearrtecnicas,
    guardarrtecnicas,
    editar,
    guardarCambios,
    eliminar,
    buscador,
}