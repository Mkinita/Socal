import { Sequelize } from 'sequelize'
import { unlink} from 'node:fs/promises'
import{ Categoria, Mensaje, Usuario, Equipo,Faena,Mantencion, Seguro,RTecnica} from '../models/index.js'
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


        const [seguros, totalS] = await Promise.all([
            Seguro.findAll({
            where:{
                FK_Usuario : id
            }
        }),
        Seguro.count({
            where:{
                FK_Usuario :id
            }
        })
    ])


    const [rtecnicas, totalR] = await Promise.all([
        RTecnica.findAll({
        where:{
            FK_Usuario : id
        }
    }),
    RTecnica.count({
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
            totalM,
            totalS,
            totalR
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



const verInformeSeguro = async (req,res) =>{
    //LEER qUERYsTRING
   

    try {
        const  {id} = req.usuario
        const [seguros] = await Promise.all([
                Seguro.findAll({
                where:{
                    FK_Usuario : id
                },
                include: [
                    { model: Equipo}
                ]
            }),
            Seguro.count({
                where:{
                    FK_Usuario :id
                }
            })
        ])


        res.render('auth/informeSeguro',{
            pagina:'Lista De Seguros',
            seguros,
            barra: true,
            csrfToken: req.csrfToken(),
            formatiarFechaMantencion
        })
    } catch (error) {
        console.log(error)
    }


}


const verInformeRtecnica = async (req,res) =>{
    //LEER qUERYsTRING
   

    try {
        const  {id} = req.usuario
        const [rtecnicas] = await Promise.all([
                RTecnica.findAll({
                where:{
                    FK_Usuario : id
                },
                include: [
                    { model: Equipo}
                ]
            }),
            RTecnica.count({
                where:{
                    FK_Usuario :id
                }
            })
        ])


        res.render('auth/informeRtecnica',{
            pagina:'Lista De R.T.',
            rtecnicas,
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
    verInformeMantencion,
    verInformeSeguro,
    verInformeRtecnica
}
