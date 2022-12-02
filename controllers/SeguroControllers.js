import { Sequelize } from 'sequelize'
import { unlink} from 'node:fs/promises'
import { validationResult } from 'express-validator'
import{ Categoria, Mensaje, Usuario, Equipo,Faena,Seguro} from '../models/index.js'
import {esVendedor,formatiarFecha} from '../helpers/index.js'


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
            limit
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

        const [seguros] = await Promise.all([
            Seguro.findAll()
    
        ])


        return res.render('auth/crear-seguro',{
            pagina:'Mis Seguros',
            barra: true,
            seguros,
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
        res.redirect('/mis-seguroS')


     

     } catch (error) {
        console.log(error)
     }



}


const guardarCambios = async (req,res) => {

    //verificar identificacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

    //condultar modelo de categoria y precio
    const [categorias,faenas] = await Promise.all([
        Categoria.findAll(),
        Faena.findAll()
    ])

        return  res.render('auth/editar',{
            pagina:'Editar Equipo',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            faenas,
            errores: resultado.array(),
            datos: req.body
        })
    }


    const {id} = req.params
    //validar que la propiedad exixta
    const equipo = await  Equipo.findByPk(id)

    if(!equipo){
        return res.redirect('/mis-equipos')
    }

    //validar quien revisa la url es el usuario
    if(equipo.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-equipos')
    }


    //reescribir el objeto

    try {

        const {titulo,descripcion,patente,categoria: FK_Categoria,faena:FK_Faena} = req.body

       equipo.set({
        titulo,
        descripcion,
        patente,
        FK_Categoria,
        FK_Faena
       })

       await equipo.save();
       res. redirect('/mis-equipos')

    } catch (error) {
        console.log(error)
    }
}

const editar = async (req,res) => {

    const {id} = req.params
    //validar que la propiedad exixta
    const equipo = await  Equipo.findByPk(id)

    if(!equipo){
        return res.redirect('/mis-equipos')
    }

    //validar quien revisa la url es el usuario
    if(equipo.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-equipos')
    }

    //condultar modelo de categoria y precio
     const [categorias,faenas] = await Promise.all([
        Categoria.findAll(),
        Faena.findAll()
    ])

    res.render('auth/editar',{
        pagina:`Editar Equipo ${equipo.titulo}`,
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        faenas,
        datos: equipo
    })
}


const eliminar = async (req, res) =>{

    //validando
    const {id} = req.params
    //validar que la propiedad exixta
    const equipo = await Equipo.findByPk(id)

    if(!equipo){
        return res.redirect('/mis-equipos')
    }

    //validar quien revisa la url es el usuario
    if(equipo.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-equipos')
    }

    //eliminar imagen
    await unlink(`public/uploads/${equipo.imagen}`)


    //eliminando la equipo
    await equipo.destroy()
    res.redirect('/mis-equipos')
    

}


export {admin,
    crear,
    guardar,
    editar,
    guardarCambios,
    eliminar,
}