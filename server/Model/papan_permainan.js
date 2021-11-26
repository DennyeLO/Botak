const Sequelize = require("sequelize");
const db = require("../Database/db");

const PapanPermainan = db.sequelize.define("papan_permainan", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_player: {
    type: Sequelize.STRING,
  },
  aktif: {
    type: Sequelize.TINYINT,
  },
});

module.exports = PapanPermainan;
