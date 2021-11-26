"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("keriting", [
      {
        kode_kartu: "K1",
      },
      {
        kode_kartu: "K2",
      },
      {
        kode_kartu: "K3",
      },
      {
        kode_kartu: "K4",
      },
      {
        kode_kartu: "K5",
      },
      {
        kode_kartu: "K6",
      },
      {
        kode_kartu: "K7",
      },
      {
        kode_kartu: "K8",
      },
      {
        kode_kartu: "K9",
      },
      {
        kode_kartu: "K10",
      },
      {
        kode_kartu: "K11",
      },
      {
        kode_kartu: "K12",
      },
      {
        kode_kartu: "K13",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("keriting", null, {});
  },
};
