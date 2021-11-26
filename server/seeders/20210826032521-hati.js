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
    return queryInterface.bulkInsert("hati", [
      {
        kode_kartu: "H1",
      },
      {
        kode_kartu: "H2",
      },
      {
        kode_kartu: "H3",
      },
      {
        kode_kartu: "H4",
      },
      {
        kode_kartu: "H5",
      },
      {
        kode_kartu: "H6",
      },
      {
        kode_kartu: "H7",
      },
      {
        kode_kartu: "H8",
      },
      {
        kode_kartu: "H9",
      },
      {
        kode_kartu: "H10",
      },
      {
        kode_kartu: "H11",
      },
      {
        kode_kartu: "H12",
      },
      {
        kode_kartu: "H13",
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
    return queryInterface.bulkDelete("hati", null, {});
  },
};
