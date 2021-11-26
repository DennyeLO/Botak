"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("hasil", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_papan: {
        type: Sequelize.STRING,
      },
      id_player: {
        type: Sequelize.STRING,
      },
      kode_kartu: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("hasil");
  },
};
