const Sequelize = require('sequelize');
const db = require ('../Database/db');

const Withdraw = db.sequelize.define('withdraw',{
    id: {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey : true
    },
    id_player: {
        type : Sequelize.INTEGER,
        allowNull: false
    },
    amount: {
        type : Sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type : Sequelize.STRING,
        allowNull: false  
    },
    handle_by: {
        type : Sequelize.STRING,
        allowNull: true
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

module.exports = Withdraw