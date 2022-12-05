import { Sequelize } from 'sequelize'
import { unlink} from 'node:fs/promises'
import { validationResult } from 'express-validator'
import{ Categoria, Mensaje, Usuario, Equipo,Faena,Chat} from '../models/index.js'
import {esVendedor,formatiarFecha} from '../helpers/index.js'



const principal = async (req,res) =>{
    
    const [usuarios] = await Promise.all([
        Usuario.findAll({
    
        })

])
        res.render('auth/chat',{
            pagina:'Lista de Usuarios',
            barra: true,
            usuarios
        })


}
const admin = async (req,res) =>{
    //LEER qUERYsTRING
    const {pagina: paginaActual} = req.query

    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mi-chat?pagina=1')
    }


    try {
        const  {id} = req.usuario

        //limites para el paginador
        const limit = 5;
        const offset= ((paginaActual * limit) - limit)

        const [equipos, total] = await Promise.all([
                Equipo.findAll({
                limit,
                offset,
                where:{
                    FK_Usuario : id
                },
                include: [
                    { model: Categoria},
                    { model: Faena},
                    { model: Mensaje, as:'mensajes'}
                ]
            }),
            Equipo.count({
                where:{
                    FK_Usuario :id
                }
            })
        ])

        


        res.render('auth/verChat',{
            pagina:'Mis Equipos',
            equipos,
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
    const [categorias,faenas] = await Promise.all([
        Categoria.findAll(),
        Faena.findAll()

    ])

    res.render('auth/crear-equipo',{
        pagina:'Crear equipos',
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        faenas,
        datos:{}
    })
}



const guardar = async (req,res) =>{
    //validacion resultado

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

    //condultar modelo de categoria y precio
    const [categorias,faenas] = await Promise.all([
        Categoria.findAll(),
        Faena.findAll()
    ])

        return res.render('auth/crear-equipo',{
            pagina:'Mis Equipos',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            faenas,
            errores: resultado.array(),
            datos: req.body
         })
     }

     // crear un registro
     const {titulo,descripcion,patente, categoria,faena} = req.body

     const {id: FK_Usuario} = req.usuario
     try {
        const equipoGuardado = await Equipo.create({
            titulo,
            descripcion,
            patente,
            FK_Categoria: categoria,
            FK_Faena: faena,
            FK_Usuario,
            imagen:''

        })


        const {id} = equipoGuardado

        res.redirect(`/equipos/agregar-imagen-socal/${id}`)

     } catch (error) {
        console.log(error)
     }


}



const eliminar = async (req, res) =>{

    //validando
    const {id} = req.params
    
    //validar que la propiedad exixta
    const alerta = true
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
    res.render('auth/alerta',{
        
    })
    

}


const mostrarPropiedad = async (req, res) =>{
    const {id} = req.params
    //validar que la propiedad exista
    const usuario = await Usuario.findByPk(id,{

    })

    if(!usuario){
        return res.redirect('/404')
    }


    res.render('auth/verChat',{
        usuario,
        pagina:'usuario.nombre',
        barra: true,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        //esVendedor:esVendedor(req.usuario?.id, usuario.FK_Usuario)
    }

    )

}







const enviarMensaje = async (req,res) =>{
    const {id} = req.params
    //validar que la propiedad exista
    const usuario = await Usuario.findByPk(id,{  
    })

    if(!usuario){
        return res.redirect('/404')
    }

    // RENDERIZAR ERRORES
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
            return res.render('auth/verChat',{
            usuario,
            pagina:'usuario.nombre',
            barra: true,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            //esVendedor:esVendedor(req.usuario?.id, equipo.FK_Usuario),
            errores: resultado.array()
        }

        )
     }

    //  console.log(req.body)
    //  console.log(req.params)
    //  console.log(req.usuario)

     const {mensaje} = req.body
     const {id:FK_Usuario} = req.params
     //const {id:FK_Usuario} = req.usuario

     //ALMACENAR EL MENSAJE
     await Chat.create({
        mensaje,
        FK_Usuario


     })


    res.render('auth/verChat',{
        usuario,
        pagina:'usuario.nombre',
        barra: true,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        // esVendedor:esVendedor(req.usuario?.id, usuario.FK_Usuario),
        enviado: true
    }

    )

}

//leer mensajes recibids


const verMensajes = async (req, res) =>{
     //validando
     const {id} = req.params
     //validar que la propiedad exixta
     const usuario = await  Usuario.findByPk(id,{
        include: [
            { model: Chat, as:'chats',
            },
        ],
     })

     if(!usuario){
         return res.redirect('/mi-chat')
     }

     //validar quien revisa la url es el usuario
     if(usuario.FK_Usuario.toString() !== req.usuario.id.toString()){
         return res.redirect('/mi-chat')
     }


    res.render('auth/mensajesChat',{
        pagina: 'Mensajes',
        barra:true,
        chats:usuario.chats,
        formatiarFecha
    })
}

export {principal,
        admin,
        crear,
        guardar,
        eliminar,
        enviarMensaje,
        verMensajes,
        mostrarPropiedad,
}
