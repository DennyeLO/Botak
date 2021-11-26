'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('player', {
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
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('player');
    }
};