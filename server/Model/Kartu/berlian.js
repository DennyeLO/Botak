const Sequelize = require("sequelize");
const db = require("../../Database/db");

const Berlian = db.sequelize.define("berlian", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  kode_kartu: {
    type: Sequelize.STRING,
  },
});

module.exports = Berlian;
