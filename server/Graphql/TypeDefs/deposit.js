const { gql } = require("apollo-server");

module.exports = gql`
    type DepositBalance {
        id: Int!
        amount: Int!
        handle_by: String!
        status: String!
        Player: Players!
    }

    type Status {
        status: String!
    }

    # Query
    type Query {
        getAllDepositPendingPlayer: WithdrawBalance!
        getAllDepositPlayer: [WithdrawBalance!]
        getDetailDepositPlayer(id: Int!): WithdrawBalance!
        getAllDepositUser: [WithdrawBalance]
        getAllDepositPendingUser: [WithdrawBalance]
        getDetailDepositUser(id_player: Int!): WithdrawBalance!
        searchDeposit(username: String!): [WithdrawBalance!]
    }

    # Mutation
    type Mutation {
        addDepositFromAdmin(amount: Int!,id_player: Int!): Status!
        addDeposit(amount: Int!): Status!
        approveDeposit(id_deposit: Int!, id_player: Int): Status!
        rejectDeposit(id_deposit: Int!, id_player: Int): Status!
    }
`;