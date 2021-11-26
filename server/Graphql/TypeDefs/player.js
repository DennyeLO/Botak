const { gql } = require("apollo-server");

module.exports = gql`
  scalar Date

  type Player {
    id: Int!
    username: String!
    player_name: String!
    token: String!
  }
  input RegisterPlayerInput {
    username: String!
    password: String!
    confirmPassword: String!
    player_name: String!
  }

  type PlayerList {
    id: Int!
    username: String!
    player_name: String!
    created_at: Date!
  }

  input UpdatePlayer{
    id: Int!
    player_name: String!
  }

  # mutations
  type Mutation {
    registerPlayer(registerInput: RegisterPlayerInput): Player!
    loginPlayer(username: String!, password: String!): Player!
    setBannedPlayer(id: Int!, status: Boolean!): Status!
    updatePlayer(input: UpdatePlayer): Status!
  }

  type Query {
    getAllPlayer: [PlayerList]
    getDetailPlayer(id: Int!): PlayerList
    searchPlayer(username: String!): PlayerList
  }
`;