const { gql } = require("apollo-server");

module.exports = gql`
    type BankAccount {
        id: Int!
        id_bank: Int!
        Bank: Banks!
        acc_name: String!
        acc_num: String!
        bank_type: String!
        status: Boolean!
    }

    type Banks{
        id: Int!
        name_bank: String!
        description: String!
    }

    type Status {
        status: String!
    }

    input AddBankAccount {
        id_bank: Int!
        acc_name: String!
        acc_num: String!
        bank_type: String!
        status: Boolean!
    }

    input UpdateBankAccount {
        id: Int!
        id_bank: Int!
        acc_name: String!
        acc_num: String!
        bank_type: String!
        status: Boolean!
    }


    # Query
    type Query {
        getAllBankAccountDeposit: [BankAccount]
        getAllBankAccountWithdraw: [BankAccount]
        getAllBankAccount: [BankAccount]
        getDetailBankAccount(id: Int!): BankAccount
    }

    # Mutation
    type Mutation {
        addBankAccount(input: AddBankAccount!): Status!
        deleteBankAccount(id: Int!): Status!
        updateBankAccount(input: UpdateBankAccount!): Status!
    }
`;