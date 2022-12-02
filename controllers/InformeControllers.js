import { Sequelize } from 'sequelize'
import { unlink} from 'node:fs/promises'
import{ Categoria, Mensaje, Usuario, Equipo,Faena,Mantencion} from '../models/index.js'



const informe = async (req,res) =>{   

     try {
        const  {id} = req.usuario
        const [equipos, total,] = await Promise.all([
                Equipo.findAll({
                where:{
                    FK_Usuario : id
                }
            }),
            Equipo.count({
                where:{
                    FK_Usuario :id
                }
            })
        ])

        const [mantenciones, totalM,] = await Promise.all([
            Mantencion.findAll({
            where:{
                FK_Usuario : id
            }
        }),
        Mantencion.count({
            where:{
                FK_Usuario :id
            }
        })
    ])


        res.render('auth/informe',{
            pagina:'Informe',
            equipos,
            mantenciones,
            barra: true,
            csrfToken: req.csrfToken(),
            total,
            totalM
        })
    } catch (error) {
        console.log(error)
    }

    

}


const verInforme = async (req,res) =>{
    //LEER qUERYsTRING
    const {pagina: paginaActual} = req.query

    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mi-informe-equipo?pagina=1')
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


        res.render('auth/informeEquipos',{
            pagina:'lISTADO DE EQUIPOS',
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





export {
    informe,
    verInforme
}
