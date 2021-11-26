const Sequelize = require("sequelize");
const db = require("../../Database/db");

const Keriting = db.sequelize.define("keriting", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  kode_kartu: {
    type: Sequelize.STRING,
  },
});

module.exports = Keriting;
