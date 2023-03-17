import { Sequelize } from 'sequelize'
import { unlink} from 'node:fs/promises'
import { validationResult } from 'express-validator'
import{ Categoria, Mensaje, Usuario, Equipo,Faena} from '../models/index.js'
import {esVendedor,formatiarFecha} from '../helpers/index.js'



const principal = async (req,res) =>{
    

        res.render('auth/principal',{
            pagina:'Panel',
            barra: true
        })


}
const admin = async (req,res) =>{
    //LEER qUERYsTRING
    const {pagina: paginaActual} = req.query

    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-equipos?pagina=1')
    }


    try {
        const  {id} = req.usuario

        //limites para el paginador
        const limit = 10;
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

        


        res.render('auth/adminSocal',{
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
     const {titulo,descripcion,patente, ano, marca, modelo, motor, serie, propietario, operador, categoria,faena} = req.body

     const {id: FK_Usuario} = req.usuario
     try {
        const equipoGuardado = await Equipo.create({
            titulo,
            descripcion,
            patente,
            ano,
            marca,
            modelo,
            motor,
            serie,
            propietario,
            operador,
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



const agregarImagen =async (req,res) =>{

    const {id} =req.params
    //validar que la propiedad exista
    const equipo = await Equipo.findByPk(id)

    if(!equipo){
        return res.redirect('/mis-equipos')
    }

    //validar que la propiedad exista
    if(equipo.publicado){
        return res.redirect('/mis-equipos')
    }

    //validad pertenece a quien visita esta pagina

    if(req.usuario.id.toString() !== equipo.FK_Usuario.toString() ){
        return res.redirect('/mis-equipos')
    }

    res.render('auth/agregar-imagen-socal',{
        pagina: `Agregar Imagen: ${equipo.titulo}`,
        barra: true,
        csrfToken: req.csrfToken(),
        equipo
    })
}

const almacenarImagen = async (req,res,next) =>{
    const {id} =req.params
    //validar que la propiedad exista
    const equipo = await Equipo.findByPk(id)

    if(!equipo){
        return res.redirect('/mis-equipos')
    }

    //validar que la propiedad exista
    if(equipo.publicado){
        return res.redirect('/mis-equipos')
    }

    //validad pertenece a quien visita esta pagina

    if(req.usuario.id.toString() !== equipo.FK_Usuario.toString() ){
        return res.redirect('/mis-equipos')
    }

    try {

        // console.log(req.file)
        //almacenar la img y publicar la equipo
        equipo.imagen = req.file.filename
        equipo.publicado = 1
        await  equipo.save()
        next()
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


const alerta = async (req,res) =>{
    
    // const [equipos] = await Promise.all([
    //     Equipo.findAll({   
    // }),
    // ])
    // res.render('auth/alerta',{
    //     equipos,
    // })
}

//mustra una propiedad

const mostrarPropiedad = async (req, res) =>{
    const {id} = req.params
    //validar que la propiedad exista
    const equipo = await Equipo.findByPk(id,{
        include: [
            { model: Categoria}
        ]
    })

    if(!equipo){
        return res.redirect('/404')
    }


    res.render('auth/mostrar',{
        equipo,
        pagina:'equipo.titulo',
        barra: true,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor:esVendedor(req.usuario?.id, equipo.FK_Usuario)
    }

    )

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
            patente:{
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },include:[
            {model:Faena},
            {model:Categoria}
        ]
    })

    res.render('auth/busquedaSocal',{
        pagina: 'Resultado de la busqueda',
        barra: true,
        equipos,
        csrfToken: req.csrfToken()
    })

}

const enviarMensaje = async (req,res) =>{
    const {id} = req.params
    //validar que la propiedad exista
    const equipo = await Equipo.findByPk(id,{
        include: [
            { model: Categoria}
        ]
    })

    if(!equipo){
        return res.redirect('/404')
    }

    // RENDERIZAR ERRORES
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
            return res.render('auth/mostrar',{
            equipo,
            pagina:'equipo.titulo',
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
     const {id:equipoId} = req.params
     const {id:FK_Usuario} = req.usuario

     //ALMACENAR EL MENSAJE
     await Mensaje.create({
        mensaje,
        equipoId,
        FK_Usuario


     })


    res.render('auth/mostrar',{
        equipo,
        pagina:'equipo.titulo',
        barra: true,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor:esVendedor(req.usuario?.id, equipo.FK_Usuario),
    }

    )

}

//leer mensajes recibids


const verMensajes = async (req, res) =>{
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
        formatiarFecha,
        enviado: true
    })




    
}




    const getEquipos = async (req, res) => {
        try {
        const equipos = await Equipo.findAll();
        
        res.json(equipos);
        } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error' });
        }
    };

export {principal,
        admin,
        crear,
        guardar,
        agregarImagen,
        almacenarImagen,
        editar,
        guardarCambios,
        eliminar,
        alerta,
        mostrarPropiedad,
        buscador,
        enviarMensaje,
        verMensajes,
        getEquipos
}
