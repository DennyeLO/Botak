const { gql } = require("apollo-server");

module.exports = gql`
  type BalanceUser{
    total: Int!
  }

  type Query {
    getBalance: BalanceUser
  }
`;