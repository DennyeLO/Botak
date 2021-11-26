const { checkAuth } = require("../../Util/check-auth");

// Cards
const Berlian = require("../../Model/Kartu/berlian");
const Hati = require("../../Model/Kartu/hati");
const Keriting = require("../../Model/Kartu/keriting");
const Sekop = require("../../Model/Kartu/sekop");

// queries
const getKartu = async (parent, args, context) => {
  const User = await checkAuth(context);

  const Cards = await Math.ceil(Math.random() * 4);

  if (Cards > 0) {
    const id = await Math.ceil(Math.random() * 13);
    if (Cards == 1) {
      return await Berlian.findOne({ where: { id } });
    } else if (Cards == 2) {
      return await Hati.findOne({ where: { id } });
    } else if (Cards == 3) {
      return await Keriting.findOne({ where: { id } });
    } else {
      return await Sekop.findOne({ where: { id } });
    }
  }
};

module.exports = {
  Query: {
    getKartu,
  },
};
