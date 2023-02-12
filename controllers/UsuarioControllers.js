import {check,validationResult} from 'express-validator'
import bcrypt  from 'bcrypt'
import Usuario from "../models/Usuario.js"
import {generar,generarId} from '../helpers/tokens.js'
import {emailRegistro, emailOlvidePassword} from '../helpers/emails.js'

const formularioLogin = (req,res) =>{
    res.render('auth/login',{
        pagina:'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })   
}


const autenticar = async(req,res) =>{
    //validacion
    await check('email').isEmail().withMessage('El Email es Olbligatorio').run(req)
    await check('password').notEmpty().withMessage('El Password es Obligatorio').run(req)

    let resultado = validationResult(req)

    //verificar que el resultado este vacio
    if(!resultado.isEmpty()){
       return res.render('auth/login',{
            pagina:'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })   
    }
    const {email,password} = req.body

    //comprobar al usuario

    const usuario = await Usuario.findOne({where:{email }})
    if(!usuario){
        return res.render('auth/login',{
            pagina:'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'El Usuario No existe'}]
        })   
    }

    // comprobar usuario confirmado
    if(!usuario){
        return res.render('auth/login',{
            pagina:'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'Tu Cuenta no ah sido confirmada'}]
        })   
    }


    //revisar el password
    if(!usuario.verificarPassword (password)){
        return res.render('auth/login',{
            pagina:'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'El Password es Incorrecto'}]
        }) 
    }


    //autenticar usuario

    const token = generarJWT({id: usuario.id, nombre: usuario.nombre})
    console.log(token)

    //Almacenar en un cookie
    return res.cookie('_token',token, {
       httpOnly: true
    //    secure: true,
    //    semeSite: true
    }).redirect('/mi-panel')
}

const cerrarSesion = (req, res) =>{
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formularioRegistro = (req,res) =>{
    res.render('auth/registro',{
        pagina:'Crear Cuenta',
        csrfToken: req.csrfToken()
    })   
}

const registrar =  async (req,res) =>{

    // console.log(req.body)
    //validar
    await check('nombre').notEmpty().withMessage('El nombre esta vacio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({min: 6}).withMessage('El Password debe ser de al menos 6 caracteres').run(req)
    // await check('repetir_password').exists('password').withMessage('Los password no son iguales').run(req)
    
    let resultado = validationResult(req)

    //verificar que el resultado este vacio
    if(!resultado.isEmpty()){
       return res.render('auth/registro',{
            pagina:'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario:{
                nombre: req.body.nombre,
                email: req.body.email
            }
        })   
    }

    //extraeer los datos 

    const {nombre,email,password} = req.body
    
    //verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({where:{email }})
    if(existeUsuario){
        return res.render('auth/registro',{
            pagina:'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Usuario Ya esta Registrado'}],
            usuario:{
                nombre: req.body.nombre,
                email: req.body.email
            }
        })   
    }
   

    //almacenar un usuario

   const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId()
    })

    //envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //mostrar msj de confiemacion

    res.render('auth/mensaje',{
        pagina:'Cuenta Creada Correctamente',
        mensaje:'Hemos Enviado Un Email De Confirmaciòn, Presiona en el enlace'
    })
    
}

const confirmar = async (req,res) =>{
    const {token} = req.params

    const usuario = await Usuario.findOne({where:{token}});

    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina:'Error Al Confirmar Tu Cuenta',
            mensaje:'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        }) 
    }

    try {

        usuario.token = null;
        usuario.confirmado = true;
        await usuario.save();
        res.render ('auth/confirmar-cuenta',
        {pagina:'Cuenta Confirmada',
         mensaje:'Usuario confirmado correctamente'
        });
         
        
        
    } catch (error) {
      console.log(error)  
    }
}

const formularioOlvidePassword = (req,res) =>{
    res.render('auth/olvide-password',{
        pagina:'Recupera tu cuenta en Socal',
        csrfToken: req.csrfToken(),
    })   
}

const resetPassword =async (req,res) =>{
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    
    let resultado = validationResult(req)

    //verificar que el resultado este vacio
    if(!resultado.isEmpty()){
       return res.render('auth/olvide-password',{
        pagina:'Recupera tu cuenta en Socal',
        csrfToken: req.csrfToken(),
        errores: resultado.array()
        })   
    }

    //Buscar el usuario
    const {email} = req.body

    const usuario = await Usuario.findOne({where:{email }})

    if(!usuario){
        return res.render('auth/olvide-password',{
            pagina:'Recupera tu cuenta en Socal',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Email no Pertenece a Ningun Usuario'}]
            })  
    }

    //generar un token y enviar el email
    usuario.token = generarId()
    await usuario.save()

    //Enviar email
    emailOlvidePassword({
        email: usuario.email,
        nombre:usuario.nombre,
        token:usuario.token
    })

    //renderizar mensaje

    res.render('auth/mensaje',{
        pagina:'Resstablece tu Password',
        mensaje:'Hemos Enviado Un Email con las Instrucciones, Presiona en el enlace'
    })
}


const comprobarToken = async (req,res)=>{
 
    const {token} = req.params

    const usuario = await Usuario.findOne({where:{token }})

    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina:'Reestablece tu Password',
            mensaje:'Hubo un error al validar tu informacion, intenta de nuevo',
            error: true
        }) 
    }


    // Mostrar formulario para modificar el password
    res.render('auth/reset-password',{
        pagina:'Reestablece tu Password',
        csrfToken: req.csrfToken()
    })

}


const nuevoPassword = async (req,res)=>{
    // validar el password

    await check('password').isLength({min: 6}).withMessage('El Password debe ser de al menos 6 caracteres').run(req)
    let resultado = validationResult(req)

    //verificar que el resultado este vacio
    if(!resultado.isEmpty()){
       return res.render('auth/reset-password',{
            pagina:'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })   
    }

    const {token} = req.params
    const {password} = req.body

    //identificar quien hace el cambio
    const usuario = await Usuario.findOne({where:{token }})
    
    //hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null

    await usuario.save()
    res.render('auth/confirmar-cuenta',
    {
        pagina:'Password Reestablecido',
        mensaje:'El Password se guardo Correctamente'
    })

}

export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    
}