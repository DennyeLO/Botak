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
    return queryInterface.bulkInsert("berlian", [
      {
        kode_kartu: "B1",
      },
      {
        kode_kartu: "B2",
      },
      {
        kode_kartu: "B3",
      },
      {
        kode_kartu: "B4",
      },
      {
        kode_kartu: "B5",
      },
      {
        kode_kartu: "B6",
      },
      {
        kode_kartu: "B7",
      },
      {
        kode_kartu: "B8",
      },
      {
        kode_kartu: "B9",
      },
      {
        kode_kartu: "B10",
      },
      {
        kode_kartu: "B11",
      },
      {
        kode_kartu: "B12",
      },
      {
        kode_kartu: "B13",
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
    return queryInterface.bulkDelete("berlian", null, {});
  },
};
