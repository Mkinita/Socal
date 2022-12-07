import { validationResult } from 'express-validator'
import{ Categoria, Faena} from '../models/index.js'




const admin = async (req,res) =>{
    //LEER qUERYsTRING
    const {pagina: paginaActual} = req.query

    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-ubicaciones?pagina=1')
    }
    try {
        const  {id} = req.usuario

        //limites para el paginador
        const limit = 20;
        const offset= ((paginaActual * limit) - limit)

        const [categorias, total] = await Promise.all([
                Categoria.findAll({
                limit,
                offset,
            }),
            Categoria.count({
                
            })
        ])
        res.render('auth/adminUbicacion',{
            pagina:'Mis Ubicaciones',
            categorias,
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
    const [categorias] = await Promise.all([
        Categoria.findAll()

    ])

    res.render('auth/crear-ubicacion',{
        pagina:'Agregar Nueva Ubicacion',
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        datos:{}
    })
}



const guardar = async (req,res) =>{
    //validacion resultado

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

    //condultar modelo de categoria y precio
    const [categorias] = await Promise.all([
        Categoria.findAll()
    ])

        return res.render('auth/crear-ubicacion',{
            pagina:'Ubicacion',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            errores: resultado.array(),
            datos: req.body
         })
     }

     // crear un registro
     const {nombre} = req.body

     
     try {
        const categoriaGuardado = await Categoria.create({
            nombre,
        })


        const {id} = categoriaGuardado

        res.redirect(`/mis-ubicaciones`)

     } catch (error) {
        console.log(error)
     }


}





const editar = async (req,res) => {

    const {id} = req.params
    //validar que la propiedad exixta
    const categoria = await  Categoria.findByPk(id)

    if(!categoria){
        return res.redirect('/mis-ubicaciones')
    }



    //condultar modelo de categoria y precio
     const [categorias] = await Promise.all([
        Categoria.findAll()
    ])

    res.render('auth/editarUbicacion',{
        pagina:`Editar Ubicacion ${categoria.nombre}`,
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        datos: categoria
    })
}

const guardarCambios = async (req,res) => {

    //verificar identificacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

    //condultar modelo de categoria y precio
    const [categorias] = await Promise.all([
        Categoria.findAll()
    ])

        return  res.render('auth/editarUbicacion',{
            pagina:'Editar Equipo',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            errores: resultado.array(),
            datos: req.body
        })
    }


    const {id} = req.params
    //validar que la propiedad exixta
    const categoria = await  Categoria.findByPk(id)

    if(!categoria){
        return res.redirect('/mis-ubicaciones')
    }




    //reescribir el objeto

    try {

        const {nombre} = req.body

       categoria.set({
        nombre
       })

       await categoria.save();
       res. redirect('/mis-ubicaciones')

    } catch (error) {
        console.log(error)
    }
}


const eliminar = async (req, res) =>{

    //validando
    const {id} = req.params
    
    //validar que la propiedad exixta
    const categoria = await Categoria.findByPk(id)


    
    if(!categoria){
        return res.redirect('/mis-ubicaciones')
    }

    
    //eliminando la categoria
    await categoria.destroy()
    res.redirect('/mis-ubicaciones')
    

}



export {admin,
        crear,
        guardar,
        editar,
        guardarCambios,
        eliminar,
}
