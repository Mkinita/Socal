import {DataTypes} from 'sequelize';
import db from '../config/db.js'


export const Equipo = db.define('equipo',{
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey:true
    },
    titulo:{
        type:DataTypes.STRING(50),
        allowNull: false
    },
    descripcion:{
        type:DataTypes.TEXT,
        allowNull: false
    },
    imagen:{
        type:DataTypes.STRING,
        allowNull: false
    }

});


export default Equipo;
