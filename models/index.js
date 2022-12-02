import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Faena from './Faena.js'
import Usuario from './Usuario.js'
import Mensaje from './Mensaje.js'
import Equipo from './Equipo.js'
import Mantencion from './Mantencion.js'
import Seguro from './Seguro.js'

Propiedad.belongsTo(Precio, {foreignKey:'FK_Precio'})
Propiedad.belongsTo(Categoria, {foreignKey:'FK_Categoria'})
Propiedad.belongsTo(Usuario, {foreignKey:'FK_Usuario'})
Propiedad.hasMany(Mensaje, {foreignKey:'propiedadId'})

//socal
Equipo.belongsTo(Categoria, {foreignKey:'FK_Categoria'})
Equipo.belongsTo(Faena, {foreignKey:'FK_Faena'})
Equipo.belongsTo(Usuario, {foreignKey:'FK_Usuario'})
Equipo.hasMany(Mensaje, {foreignKey:'equipoId'})

//Mensaje.belongsTo(Propiedad, {foreignKey:'propiedadId'})
Mensaje.belongsTo(Usuario, {foreignKey:'FK_Usuario'})
Mantencion.belongsTo(Equipo, {foreignKey:'equipoId'})
Mantencion.belongsTo(Usuario, {foreignKey:'FK_Usuario'})

Seguro.belongsTo(Equipo, {foreignKey:'equipoId'})
Seguro.belongsTo(Usuario, {foreignKey:'FK_Usuario'})



export {
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje,
    Equipo,
    Faena,
    Mantencion,
    Seguro
}