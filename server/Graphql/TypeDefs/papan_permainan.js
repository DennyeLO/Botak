const { gql } = require("apollo-server-express");

module.exports = gql`
  type Papan {
    id: Int
    id_player: Int
    aktif: Int
  }

  # mutations
  type Mutation {
    masukGame(id: Int!): Papan!
    keluarGame(id: Int!): Papan!
  }
`;
