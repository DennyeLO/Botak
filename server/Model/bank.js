const Sequelize = require('sequelize');
const db = require ('../Database/db');
const BankAccount = require('./bank_account');
const PlayerBankAccount = require('./player_bank_account');

const Bank = db.sequelize.define('bank',{
    id: {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey : true
    },
    name_bank: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    bank_length: {
        type: Sequelize.INTEGER,
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

// Bank Account
Bank.hasMany(BankAccount,{as : 'BankAccount', foreignKey : 'id_bank'});
BankAccount.belongsTo(Bank,{as : 'Bank', foreignKey : 'id_bank'});

Bank.hasMany(PlayerBankAccount,{as : 'PlayerBankAccount', foreignKey : 'id_bank'});
PlayerBankAccount.belongsTo(Bank,{as : 'Bank', foreignKey : 'id_bank'});

module.exports = Bank