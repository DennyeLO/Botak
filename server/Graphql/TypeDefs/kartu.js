const { gql } = require("apollo-server-express");

module.exports = gql`
  type Kartu {
    id: Int!
    kode_kartu: String!
  }

  # queries
  type Query {
    getKartu: Kartu!
  }
`;
