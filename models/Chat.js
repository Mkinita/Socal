import {DataTypes} from 'sequelize';
import db from '../config/db.js'


export const Chat= db.define('chat',{
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


export default Chat