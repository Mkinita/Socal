import {DataTypes} from 'sequelize';
import db from '../config/db.js'


export const Propiedad= db.define('propiedad',{
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
    habitaciones:{
        type:DataTypes.INTEGER,
        allowNull: false
    },
    estacionamiento:{
        type:DataTypes.INTEGER,
        allowNull: false
    },
    WC:{
        type:DataTypes.INTEGER,
        allowNull: false
    },
    calle:{
        type:DataTypes.STRING(50),
        allowNull: false
    },
    lat:{
        type:DataTypes.STRING,
        allowNull: false
    },
    lng:{
        type:DataTypes.STRING,
        allowNull: false
    },
    imagen:{
        type:DataTypes.STRING,
        allowNull: false
    },
    publicado:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
    }

});


export default Propiedad;
