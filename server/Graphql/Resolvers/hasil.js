const { checkAuth } = require("../../Util/check-auth");
const { UserInputError } = require("apollo-server");

const Hasil = require("../../Model/hasil");
const PapanPermainan = require("../../Model/papan_permainan");

// query
const getHasil = async (_, args, context) => {
  const User = await checkAuth(context);

  return await Hasil.findAll({ where: { id_user: User.id } });
};

// mutations
const saveKartu = async (_, { kartu: { kode_kartu, status } }, context) => {
  const User = await checkAuth(context);
  const id_user = User.id;
  const Papan = await PapanPermainan.findOne({ where: { id_user } });
  if (!Papan) {
    throw new UserInputError("Errors", "Belum Masuk Ke Dalam Game");
  }
  const newHasil = await new Hasil({
    kode_kartu,
    id_papan: Papan.id,
    id_user,
    status,
  }).save();

  return newHasil;
};

module.exports = {
  Query: {
    getHasil,
  },
  Mutation: {
    saveKartu,
  },
};
