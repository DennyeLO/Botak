'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('user', {
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
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user');
    }
};