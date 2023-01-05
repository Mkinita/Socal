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
    patente:{
        type:DataTypes.STRING(10),
        allowNull: false
    },
    ano:{
        type:DataTypes.STRING(4),
        allowNull: false
    },

    marca:{
            type:DataTypes.STRING(20),
            allowNull: false
        },

    modelo:{
            type:DataTypes.STRING(20),
            allowNull: false
        },

    motor:{
            type:DataTypes.STRING(20),
            allowNull: false
        },

    serie:{
            type:DataTypes.STRING(20),
            allowNull: false
        },

    propietario:{
            type:DataTypes.STRING(20),
            allowNull: false
        },

    operador:{
            type:DataTypes.STRING(20),
            allowNull: false
        },
    imagen:{
        type:DataTypes.STRING,
        allowNull: false
    }

});


export default Equipo;
