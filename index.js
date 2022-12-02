import  express  from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import UsuarioRoutes from './routes/UsuarioRoutes.js'
import PropiedadesRoutes from './routes/PropiedadesRoutes.js'
import EquiposRoutes from './routes/EquiposRoutes.js'
import MantencionRoutes from './routes/MantencionRoutes.js'
import SeguroRoutes from './routes/SeguroRoutes.js'
import InformeRoutes from './routes/InformeRoutes.js'
import appRoutes from './routes/appRoutes.js'
import db from './config/db.js'


// crear la app
const app = express()

//habilitar datos de lectura en formularios
app.use(express.urlencoded ({extended:true}))

//habitar cookie parser
app.use(cookieParser())

// hablitar CSRF
app.use(csrf({cookie: true}))


//conxion a la db
try {
    await db.authenticate();
    db.sync()
    console.log('Conexion correta a la Base de dados')
} catch (error) {
    console.log(error)
}

//pug habilitar
app.set('view engine', 'pug')
app.set('views','./views')

//carpeta publica
app.use (express.static('public'))


//routing
app.use('/auth',appRoutes)
app.use('/auth',UsuarioRoutes)
app.use('/',PropiedadesRoutes)
app.use('/',EquiposRoutes)
app.use('/',MantencionRoutes)
app.use('/',InformeRoutes)
app.use('/',SeguroRoutes)





//definir un puerto y arrancar el proyecto
const PORT = process.env.PORT || 3000 ;

//app.listen(port,()=>{
   // console.log(`funcionando en el puerto ${port}`);
//});


app.listen(PORT)
console.log('funcionando on port',PORT)








