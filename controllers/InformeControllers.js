import { Sequelize } from 'sequelize'
import { unlink} from 'node:fs/promises'
import{ Categoria, Mensaje, Usuario, Equipo,Faena,Mantencion} from '../models/index.js'
import { validationResult } from 'express-validator'
import {esVendedor,formatiarFechaMantencion} from '../helpers/fecha.js'



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
    try {
        const  {id} = req.usuario
        const [equipos] = await Promise.all([
                Equipo.findAll({
                where:{
                    FK_Usuario : id
                },
                include: [
                    { model: Categoria},
                    { model: Faena}
                ]
            }),
            Equipo.count({
                where:{
                    FK_Usuario :id
                }
            })
        ])


        res.render('auth/informeMisEquipos',{
            pagina:'lISTADO DE EQUIPOS',
            equipos,
            barra: true,
            csrfToken: req.csrfToken(),
        })
    } catch (error) {
        console.log(error)
    }


}


const verInformeMantencion = async (req,res) =>{
    //LEER qUERYsTRING
   

    try {
        const  {id} = req.usuario
        const [mantenciones] = await Promise.all([
                Mantencion.findAll({
                where:{
                    FK_Usuario : id
                },
                include: [
                    { model: Equipo}
                ]
            }),
            Mantencion.count({
                where:{
                    FK_Usuario :id
                }
            })
        ])


        res.render('auth/informeMantencion',{
            pagina:'Lista De Mantenciones',
            mantenciones,
            barra: true,
            csrfToken: req.csrfToken(),
            formatiarFechaMantencion
        })
    } catch (error) {
        console.log(error)
    }


}





export {
    informe,
    verInforme,
    verInformeMantencion
}
