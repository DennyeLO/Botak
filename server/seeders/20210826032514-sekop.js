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
    return queryInterface.bulkInsert("sekop", [
      {
        kode_kartu: "S1",
      },
      {
        kode_kartu: "S2",
      },
      {
        kode_kartu: "S3",
      },
      {
        kode_kartu: "S4",
      },
      {
        kode_kartu: "S5",
      },
      {
        kode_kartu: "S6",
      },
      {
        kode_kartu: "S7",
      },
      {
        kode_kartu: "S8",
      },
      {
        kode_kartu: "S9",
      },
      {
        kode_kartu: "S10",
      },
      {
        kode_kartu: "S11",
      },
      {
        kode_kartu: "S12",
      },
      {
        kode_kartu: "S13",
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
    return queryInterface.bulkDelete("sekop", null, {});
  },
};
