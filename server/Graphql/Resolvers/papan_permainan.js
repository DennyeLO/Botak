const { checkAuth } = require("../../Util/check-auth");

const Hasil = require("../../Model/hasil");
const PapanPermainan = require("../../Model/papan_permainan");
const { UserInputError } = require("apollo-server");

// mutations
const masukGame = async (_, { id }, context) => {
  const User = await checkAuth(context);

  const userPapan = await PapanPermainan.findOne({ where: { id_user: User.id } });

  if (userPapan) {
    errors = "User dalam permainan";
    throw new UserInputError("Errors", { errors });
  }

  const Papan = await PapanPermainan.update(
    {
      id_user: User.id,
      aktif: true,
    },
    { where: { id } }
  );

  return Papan;
};

const keluarGame = async (_, { id }, context) => {
  const User = await checkAuth(context);

  const Papan = await PapanPermainan.update(
    {
      id_user: "NULL",
      aktif: false,
    },
    { where: { id } }
  );

  return Papan;
};

module.exports = {
  Mutation: {
    masukGame,
    keluarGame,
  },
};
