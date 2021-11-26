const Sequelize = require('sequelize');
const db = require ('../Database/db');

const WalletUserTransaction = db.sequelize.define('wallet_user_transaction',{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey : true
    },
    id_wallet : {
        type : Sequelize.INTEGER,
        allowNull: false,
    },
    opening_balance : {
        type : Sequelize.INTEGER,
        allowNull: false,
        defaultValue : 0
    },
    amount : {
        type : Sequelize.INTEGER,
        allowNull: false,
        defaultValue : 0
    },
    closing_balance : {
        type : Sequelize.INTEGER,
        allowNull: false,
        defaultValue : 0
    },
    type : {
        type : Sequelize.STRING,
        allowNull: false
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

module.exports = WalletUserTransaction