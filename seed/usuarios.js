import bcrypt from 'bcrypt'


const usuarios = [
    {
        nombre: 'CARLOS',
        email: 'Correo@correo.cl',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }
]



export default usuarios