'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('withdraw', {
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
                defaultValue: '-'
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
        return queryInterface.dropTable('withdraw');
    }
};