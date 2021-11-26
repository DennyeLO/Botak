const Sequelize = require('sequelize');
const db = require ('../Database/db');

const PlayerBankAccount = db.sequelize.define('player_bank_account',{
    id: {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey : true
    },
    id_player: {
        type : Sequelize.INTEGER,
        allowNull: false
    },
    id_bank: {
        type : Sequelize.INTEGER,
        allowNull: false
    },
    acc_name: {
        type : Sequelize.STRING,
        allowNull: false
    },
    acc_num: {
        type : Sequelize.STRING,
        allowNull: false 
    },
    status: {
        type : Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
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

module.exports = PlayerBankAccount