import { validationResult } from 'express-validator'
import{Faena} from '../models/index.js'




const admin = async (req,res) =>{
    //LEER qUERYsTRING
    const {pagina: paginaActual} = req.query

    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-faenas?pagina=1')
    }
    try {
        const  {id} = req.usuario

        //limites para el paginador
        const limit = 20;
        const offset= ((paginaActual * limit) - limit)

        const [faenas, total] = await Promise.all([
                Faena.findAll({
                limit,
                offset,
            }),
            Faena.count({
                
            })
        ])
        res.render('auth/adminFaena',{
            pagina:'Mis faenas',
            faenas,
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
    const [faenas] = await Promise.all([
        Faena.findAll()

    ])

    res.render('auth/crear-faena',{
        pagina:'Agregar Nueva Faena',
        barra: true,
        csrfToken: req.csrfToken(),
        faenas,
        datos:{}
    })
}



const guardar = async (req,res) =>{
    //validacion resultado

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

    //condultar modelo de categoria y precio
    const [faenas] = await Promise.all([
        Faena.findAll()
    ])

        return res.render('auth/crear-faena',{
            pagina:'Faenas',
            barra: true,
            csrfToken: req.csrfToken(),
            faenas,
            errores: resultado.array(),
            datos: req.body
         })
     }

     // crear un registro
     const {nombre} = req.body

     
     try {
        const faenaGuardado = await Faena.create({
            nombre,
        })


        const {id} = faenaGuardado

        res.redirect(`/mis-faenas`)

     } catch (error) {
        console.log(error)
     }


}





const editar = async (req,res) => {

    const {id} = req.params
    //validar que la propiedad exixta
    const faena = await  Faena.findByPk(id)

    if(!faena){
        return res.redirect('/mis-faenas')
    }



    //condultar modelo de categoria y precio
     const [faenas] = await Promise.all([
        Faena.findAll()
    ])

    res.render('auth/editarFaena',{
        pagina:`Editar Faena ${faena.nombre}`,
        barra: true,
        csrfToken: req.csrfToken(),
        faenas,
        datos: faena
    })
}

const guardarCambios = async (req,res) => {

    //verificar identificacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

    //condultar modelo de categoria y precio
    const [faenas] = await Promise.all([
        Faena.findAll()
    ])

        return  res.render('auth/editarFaena',{
            pagina:'Editar Faena',
            barra: true,
            csrfToken: req.csrfToken(),
            faenas,
            errores: resultado.array(),
            datos: req.body
        })
    }


    const {id} = req.params
    //validar que la propiedad exixta
    const faena = await  Faena.findByPk(id)

    if(!faena){
        return res.redirect('/mis-faenas')
    }




    //reescribir el objeto

    try {

        const {nombre} = req.body

       faena.set({
        nombre
       })

       await faena.save();
       res. redirect('/mis-faenas')

    } catch (error) {
        console.log(error)
    }
}


const eliminar = async (req, res) =>{

    //validando
    const {id} = req.params
    
    //validar que la propiedad exixta
    const faena = await Faena.findByPk(id)


    
    if(!faena){
        return res.redirect('/mis-faenas')
    }

    
    //eliminando la categoria
    await faena.destroy()
    res.redirect('/mis-faenas')
    

}





export {admin,
        crear,
        guardar,
        editar,
        guardarCambios,
        eliminar,
}
