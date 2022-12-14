import {DataTypes} from 'sequelize';
import db from '../config/db.js'


export const Mantencion = db.define('mantencion',{
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey:true
    },
    patente:{
        type:DataTypes.STRING(10),
        allowNull: false
    },
    fechainicio:{
        type: DataTypes.DATE,
        allowNull: false
    },
    fechafin:{
        type: DataTypes.DATE,
        allowNull: false
    },
    descripcion:{
        type:DataTypes.TEXT,
        allowNull: false
    },
    kilometraje:{
        type:DataTypes.STRING(15),
        allowNull: false
    }

});


export default Mantencion;