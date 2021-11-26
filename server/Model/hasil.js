const Sequelize = require("sequelize");
const db = require("../Database/db");

const Hasil = db.sequelize.define("hasil", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_player: {
    type: Sequelize.STRING,
  },
  id_papan: {
    type: Sequelize.STRING,
  },
  kode_kartu: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
});

module.exports = Hasil;
