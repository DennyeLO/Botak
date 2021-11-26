const { gql } = require("apollo-server");

module.exports = gql`
    type Bank {
        id: Int!
        name_bank: String!
        description: String!
        bank_length: Int!
    }

    type Status {
        status: String!
    }

    input AddBank {
        name_bank: String!
        description: String!
        bank_length: Int!
    }

    input UpdateBank {
        id: Int!
        name_bank: String!
        description: String!
        bank_length: Int!
    }


    # Query
    type Query {
        getAllBank: [Bank!]
        getDetailBank(id: Int!): Bank
    }

    # Mutation
    type Mutation {
        addBank(input: AddBank!): Status!
        deleteBank(id: Int!): Status!
        updateBank(input: UpdateBank!): Status!
    }
`;