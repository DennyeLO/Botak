const Sequelize = require("sequelize");
const db = require("../../Database/db");

const Sekop = db.sequelize.define("sekop", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  kode_kartu: {
    type: Sequelize.STRING,
  },
});

module.exports = Sekop;
