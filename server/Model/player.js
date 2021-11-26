const Sequelize = require("sequelize");
const db = require("../Database/db");
const Adjustment = require("./adjustment");
const Deposit = require("./deposit");
const PlayerBankAccount = require("./player_bank_account");
const Wallet = require("./wallet");
const Withdraw = require("./withdraw");

const Player = db.sequelize.define("player", {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey : true
    },
    username: {
        type : Sequelize.STRING,
        allowNull: false
    },
    password: {
        type : Sequelize.STRING,
        allowNull: false
    },
    player_name: {
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

// Wallet
Player.hasOne(Wallet,{as : 'Wallet', foreignKey : 'id_player'});
Wallet.belongsTo(Player,{as : 'Player', foreignKey : 'id_player'});

// Deposit
Player.hasMany(Deposit,{as : 'Deposit', foreignKey : 'id_player'});
Deposit.belongsTo(Player,{as : 'Player', foreignKey : 'id_player'});

// Withdraw
Player.hasMany(Withdraw,{as : 'Withdraw', foreignKey : 'id_player'});
Withdraw.belongsTo(Player,{as : 'Player', foreignKey : 'id_player'});

// Addjustment
Player.hasMany(Adjustment,{as : 'Adjustment', foreignKey : 'id_player'});
Adjustment.belongsTo(Player,{as : 'Player', foreignKey : 'id_player'});

// Player Bank Account
Player.hasMany(PlayerBankAccount,{as : 'PlayerBankAccount', foreignKey : 'id_player'});
PlayerBankAccount.belongsTo(Player,{as : 'Player', foreignKey : 'id_player'});

module.exports = Player;