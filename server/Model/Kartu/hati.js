const Sequelize = require("sequelize");
const db = require("../../Database/db");

const Hati = db.sequelize.define("hati", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  kode_kartu: {
    type: Sequelize.STRING,
  },
});

module.exports = Hati;
