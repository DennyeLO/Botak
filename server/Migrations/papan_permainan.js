"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("papan_permainan", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_player: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      aktif: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("papan_permainan");
  },
};
