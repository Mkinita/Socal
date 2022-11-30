import { unlink} from 'node:fs/promises'
import { validationResult } from 'express-validator'
import{ Precio,Categoria, Propiedad, Mensaje,Usuario,Equipo} from '../models/index.js'
import {esVendedor,formatiarFecha} from '../helpers/index.js'


const admin = async (req,res) =>{
    //LEER qUERYsTRING
    const {pagina: paginaActual} = req.query

    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-propiedades?pagina=1')
    }


    try {
        const  {id} = req.usuario

        //limites para el paginador
        const limit = 5;
        const offset= ((paginaActual * limit) - limit)

        const [propiedades, total] = await Promise.all([
                Propiedad.findAll({
                limit,
                offset,
                where:{
                    FK_Usuario : id
                },
                include: [
                    { model: Categoria},
                    { model: Precio},
                    { model: Mensaje, as:'mensajes'}
                ]
            }),
            Propiedad.count({
                where:{
                    FK_Usuario :id
                }
            })
        ])


        res.render('auth/admin',{
            pagina:'Mis Equipos',
            propiedades,
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

    //condultar modelo de categoria y precio
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('auth/crear',{
        pagina:'Crear Propiedades',
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos:{}
    })
}



const guardar = async (req,res) =>{
    //validacion resultado

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

    //condultar modelo de categoria y precio
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

        return res.render('auth/crear',{
            pagina:'Mis Propiedades',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
         })
     }

     // crear un registro
     const {titulo,descripcion,habitaciones,estacionamiento,WC,calle,lat,lng, precio, categoria} = req.body

     const {id: FK_Usuario} = req.usuario
     try {
        const propiedadGuardado = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            WC,
            calle,
            lat,
            lng,
            FK_Precio: precio,
            FK_Categoria: categoria,
            FK_Usuario,
            imagen:''

        })


        const {id} = propiedadGuardado

        res.redirect(`/propiedades/agregar-imagen/${id}`)

     } catch (error) {
        console.log(error)
     }


}



const agregarImagen =async (req,res) =>{

    const {id} =req.params
    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad exista
    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }

    //validad pertenece a quien visita esta pagina

    if(req.usuario.id.toString() !== propiedad.FK_Usuario.toString() ){
        return res.redirect('/mis-propiedades')
    }

    res.render('auth/agregar-imagen',{
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        barra: true,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

const almacenarImagen = async (req,res,next) =>{
    const {id} =req.params
    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad exista
    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }

    //validad pertenece a quien visita esta pagina

    if(req.usuario.id.toString() !== propiedad.FK_Usuario.toString() ){
        return res.redirect('/mis-propiedades')
    }

    try {

        // console.log(req.file)
        //almacenar la img y publicar la propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1
        await  propiedad.save()
        next()
    } catch (error) {
        console.log(error)
    }
}


const editar = async (req,res) => {

    const {id} = req.params
    //validar que la propiedad exixta
    const propiedad = await  Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //validar quien revisa la url es el usuario
    if(propiedad.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    //condultar modelo de categoria y precio
     const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('auth/editar',{
        pagina:`Editar Propiedad ${propiedad.titulo}`,
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

const guardarCambios = async (req,res) => {

    //verificar identificacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

    //condultar modelo de categoria y precio
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

        return  res.render('auth/editar',{
            pagina:'Editar Propiedad',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }


    const {id} = req.params
    //validar que la propiedad exixta
    const propiedad = await  Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //validar quien revisa la url es el usuario
    if(propiedad.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }


    //reescribir el objeto

    try {

        const {titulo,descripcion,habitaciones,estacionamiento,WC,calle,lat,lng, precio: FK_Precio, categoria: FK_Categoria} = req.body

       propiedad.set({
        titulo,
        descripcion,
        habitaciones,
        estacionamiento,
        WC,
        calle,
        lat,
        lng,
        FK_Precio,
        FK_Categoria
       })

       await propiedad.save();
       res. redirect('/mis-propiedades')

    } catch (error) {
        console.log(error)
    }
}


const eliminar = async (req, res) =>{

    //validando
    const {id} = req.params
    //validar que la propiedad exixta
    const propiedad = await  Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //validar quien revisa la url es el usuario
    if(propiedad.FK_Usuario.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    //eliminar imagen
    await unlink(`public/uploads/${propiedad.imagen}`)


    //eliminando la propiedad
    await propiedad.destroy()
    res.redirect('/mis-propiedades')

}

//mustra una propiedad

const mostrarPropiedad = async (req, res) =>{
    const {id} = req.params
    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id,{
        include: [
            { model: Categoria},
            { model: Precio}
        ]
    })

    if(!propiedad){
        return res.redirect('/404')
    }


    res.render('auth/mostrar',{
        propiedad,
        pagina:'propiedad.titulo',
        barra: true,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor:esVendedor(req.usuario?.id, propiedad.FK_Usuario)
    }

    )

}

const enviarMensaje = async (req,res) =>{
    const {id} = req.params
    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id,{
        include: [
            { model: Categoria},
            { model: Precio}
        ]
    })

    if(!propiedad){
        return res.redirect('/404')
    }

    // RENDERIZAR ERRORES
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
            return res.render('auth/mostrar',{
            propiedad,
            pagina:'propiedad.titulo',
            barra: true,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor:esVendedor(req.usuario?.id, propiedad.FK_Usuario),
            errores: resultado.array()
        }

        )
     }

    //  console.log(req.body)
    //  console.log(req.params)
    //  console.log(req.usuario)

     const {mensaje} = req.body
     const {id:propiedadId} = req.params
     const {id:FK_Usuario} = req.usuario

     //ALMACENAR EL MENSAJE
     await Mensaje.create({
        mensaje,
        propiedadId,
        FK_Usuario


     })


    res.render('auth/mostrar',{
        propiedad,
        pagina:'propiedad.titulo',
        barra: true,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor:esVendedor(req.usuario?.id, propiedad.FK_Usuario),
        enviado: true
    }

    )

}

//leer mensajes recibids


const verMensaje = async (req, res) =>{
     //validando
     const {id} = req.params
     //validar que la propiedad exixta
     const equipo = await  Equipo.findByPk(id,{
        include: [
            { model: Mensaje, as:'mensajes',
                include:[
                    {model: Usuario.scope('eliminarPassword'), as:'usuario'}
                ]
            },
        ],
     })

     if(!equipo){
         return res.redirect('/mis-equipos')
     }

     //validar quien revisa la url es el usuario
     if(equipo.FK_Usuario.toString() !== req.usuario.id.toString()){
         return res.redirect('/mis-equipos')
     }


    res.render('auth/mensajes',{
        pagina: 'Mensajes',
        barra:true,
        mensajes:equipo.mensajes,
        formatiarFecha
    })
}

export {admin,
        crear,
        guardar,
        agregarImagen,
        almacenarImagen,
        editar,
        guardarCambios,
        eliminar,
        mostrarPropiedad,
        enviarMensaje,
        verMensaje
}