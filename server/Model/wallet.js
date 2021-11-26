const Sequelize = require('sequelize');
const db = require ('../Database/db');
const WalletUserTransaction = require('./wallet_user_transaction');

const Wallet = db.sequelize.define('wallet',{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey : true
    },
    id_player : {
        type : Sequelize.INTEGER,
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

// Wallet User Transaction
Wallet.hasMany(WalletUserTransaction,{as : 'WalletUserTransaction', foreignKey : 'id_wallet'});
WalletUserTransaction.belongsTo(Wallet,{as : 'Wallet', foreignKey : 'id_wallet'});


module.exports = Wallet