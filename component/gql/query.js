import { gql } from "graphql-tag";

export const GET_BALANCE = gql`
    query getBalance{
        getBalance{
            total
        }
    }
`;

export const GET_DEPOSIT = gql`
    query getAllDepositPlayer{
        getAllDepositPlayer{
            id
            amount
            status
        }
    }
`;

export const GET_WITHDRAW = gql`
    query getAllWithdrawPlayer{
        getAllWithdrawPlayer{
            id
            amount
            status
        }
    }
`;

export const GET_ALL_BANK = gql`
    query getAllBank{
        getAllBank{
            id
            name_bank
            description
            bank_length
        }
    }
`;

export const GET_ALL_BANK_ACCOUNT_DEPOSIT = gql`
    query getAllBankAccountDeposit{
        getAllBankAccountDeposit{
            id
            acc_name
            acc_num
            bank_type
            status
            Bank{
                name_bank
                description
            }
        }
    }
`;
export const GET_ALL_BANK_ACCOUNT_WITHDRAW = gql`
    query getAllBankAccountWithdraw{
        getAllBankAccountWithdraw{
            id
            acc_name
            acc_num
            bank_type
            status
            Bank{
                name_bank
                description
            }
        }
    }
`;