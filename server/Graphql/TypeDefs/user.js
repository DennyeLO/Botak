const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: Int!
    username: String!
    token: String!
  }
  input RegisterUserInput {
    username: String!
    password: String!
    confirmPassword: String!
  }

  # mutations
  type Mutation {
    registerUser(registerInput: RegisterUserInput): User!
    loginUser(username: String!, password: String!): User!
  }
`;