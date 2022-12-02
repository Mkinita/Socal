import {DataTypes} from 'sequelize';
import db from '../config/db.js'


export const Seguro = db.define('seguro',{
    numeropoliza:{
        type:DataTypes.STRING(20),
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


export default Seguro;