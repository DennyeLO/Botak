const { gql } = require("apollo-server");

module.exports = gql`
    type AdjustmentBalance {
        id: Int!
        id_player: Int!
        type: String!
        amount: Int!
        affect_amount: Int!
        note: String!
    }

    type Status {
        status: String!
    }

    input AdjustmentInput {
        id_player: Int!
        type: String!
        amount: Int!
        note: String!
    }

    # Query
    type Query {
        getAllAdjustment: [AdjustmentBalance!]
    }

    # Mutation
    type Mutation {
        addAdjustment(input: AdjustmentInput!): Status!
    }
`;