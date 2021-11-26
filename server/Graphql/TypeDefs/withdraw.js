const { gql } = require("apollo-server");

module.exports = gql`
    type WithdrawBalance {
        id: Int!
        amount: Int!
        status: String!
        handle_by: String!
        Player: Players!
    }

    type Players{
        id: Int!
        username: String!
    }

    type Status {
        status: String!
    }

    # Query
    type Query {
        getWithdrawPendingPlayer: WithdrawBalance!
        getAllWithdrawPlayer: [WithdrawBalance!]
        getDetailWithdrawPlayer(id: Int!): WithdrawBalance!
        getAllWithdrawUser: [WithdrawBalance]
        getAllWithdrawPendingUser: [WithdrawBalance]
        getDetailWithdrawUser(id_player: Int!): WithdrawBalance!
        searchWithdraw(username: String!): [WithdrawBalance!]
    }

    # Mutation
    type Mutation {
        addWithdrawFromAdmin(amount: Int!, id_player: Int!): Status!
        addWithdraw(amount: Int!): Status!
        approveWithdraw(id_withdraw: Int!, id_player: Int!): Status!
        rejectWithdraw(id_withdraw: Int!, id_player: Int!): Status!
    }
`;