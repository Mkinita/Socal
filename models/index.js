import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'
import Mensaje from './Mensaje.js'
import Equipo from './Equipo.js'

Propiedad.belongsTo(Precio, {foreignKey:'FK_Precio'})
Propiedad.belongsTo(Categoria, {foreignKey:'FK_Categoria'})
Propiedad.belongsTo(Usuario, {foreignKey:'FK_Usuario'})
Propiedad.hasMany(Mensaje, {foreignKey:'propiedadId'})

//socal
Equipo.belongsTo(Categoria, {foreignKey:'FK_Categoria'})
Equipo.belongsTo(Usuario, {foreignKey:'FK_Usuario'})
//Equipo.hasMany(Mensaje, {foreignKey:'equipoId'})

Mensaje.belongsTo(Propiedad, {foreignKey:'propiedadId'})
Mensaje.belongsTo(Usuario, {foreignKey:'FK_Usuario'})



export {
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje,
    Equipo
}