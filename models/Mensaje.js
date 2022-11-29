import {DataTypes} from 'sequelize';
import db from '../config/db.js'


export const Mensaje= db.define('mensajes',{
    mensaje:{
        type:DataTypes.STRING(100),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }

});


export default Mensaje