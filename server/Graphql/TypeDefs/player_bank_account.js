const { gql } = require("apollo-server");

module.exports = gql`
    scalar Date

    type Status {
        status: String!
    }

    type PlayerBankAccount{
        id: Int!
        id_player: Int!
        id_bank: Int!
        Bank: Banks!
        acc_name: String!
        acc_num: String!
        status: Int!
        created_at: Date
    }
    
    input AddPlayerBankAccount {
        id_player: Int!
        id_bank: Int!
        acc_name: String!
        acc_num: String!
        status: Boolean!
    }

    input UpdatePlayerBankAccount {
        id: Int!
        id_bank: Int!
        acc_name: String!
        acc_num: String!
        status: Boolean!
    }

    # Mutation
    type Mutation {
        addPlayerBankAccount(input: AddPlayerBankAccount!): Status!
        deletePlayerBankAccount(id: Int!): Status!
        updatePlayerBankAccount(input: UpdatePlayerBankAccount!): Status!
    }
    
    type Query {
        getAllPlayerBankAccount(id: Int!): [PlayerBankAccount]
        getDetailPlayerBankAccount(id: Int!, id_player: Int!): PlayerBankAccount
    }
`;