import {DataTypes} from 'sequelize';
import db from '../config/db.js'


export const Precio= db.define('precio',{
    nombre:{
        type:DataTypes.STRING(50),
        allowNull: false
    }
});


export default Precio