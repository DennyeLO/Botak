const { gql } = require("apollo-server-express");

module.exports = gql`
  type Hasil {
    id: Int
    kode_kartu: String
    id_player: String
    id_papan: String
    status: String
  }

  input kartuInput {
    kode_kartu: String!
    status: Int!
  }

  #   queries
  type Query {
    getHasil: [Hasil]!
  }

  #   mutations
  type Mutation {
    saveKartu(kartu: kartuInput!): Hasil!
  }
`;
