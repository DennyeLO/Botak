const Sequelize = require('sequelize');
const db = require ('../Database/db');
const Deposit = require('./deposit');

const Role = db.sequelize.define('role',{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey : true
    },
    username : {
        type : Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password : {
        type : Sequelize.STRING
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});

module.exports = Role