import {DataTypes} from 'sequelize';
import db from '../config/db.js'


export const RTecnica = db.define('rtecnica',{
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
    }
});


export default RTecnica;