import nodemailer from 'nodemailer'


const emailRegistro = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    const {email,nombre,token} = datos
    //enviar el mail
     await transport.sendMail({
        from:"BienesRaices.cl",
        to: email,
        subject: 'Comprueba tu cuenta en BienesRaices.cl',
        text:'Comprueba tu cuenta en BienesRaices.cl',
        html:`<p> Hola: ${nombre}, Comprueba tu cuenta en BienesRaices.cl.</p>
            <p> Tu cuenta ya esta lista, solo debes comprobarla en el siguiete enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Comprobar cuenta</a></p>
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    })

}

    const emailOlvidePassword = async (datos) =>{
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
        });
        const {email,nombre,token} = datos
        //enviar el mail
         await transport.sendMail({
            from:"BienesRaices.cl",
            to: email,
            subject: 'Reestablece tu Password en BienesRaices.cl',
            text:'Reestablece tu Password en BienesRaices.cl',
            html:`<p> Hola: ${nombre}, Has solicitado reestablecer tu password en BienesRaices.cl.</p>
                <p>Sigue el siguiete enlace para generar un password nuevo:
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablecer Password</a></p>
                <p>Si tu no solicitaste el cambio de password, puedes ignorar este mensaje</p>
            `
        })
    
       
    }


export{
    emailRegistro,
    emailOlvidePassword
}