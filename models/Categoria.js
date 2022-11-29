import {DataTypes} from 'sequelize';
import db from '../config/db.js'


export const Categoria= db.define('categoria',{
    nombre:{
        type:DataTypes.STRING(50),
        allowNull: false
    }
});


export default Categoria