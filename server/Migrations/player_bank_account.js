'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('player_bank_account', {
            id: {
                type : Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey : true
            },
            id_player: {
                type : Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'player', key: 'id' }
            },
            id_bank: {
                type : Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'bank', key: 'id' }
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
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('player_bank_account');
    }
};