import {DataTypes} from 'sequelize';
import db from '../config/db.js'


export const Faena= db.define('faena',{
    nombre:{
        type:DataTypes.STRING(50),
        allowNull: false
    }
});


export default Faena