import { gql } from "graphql-tag";

export const LOGIN = gql`
  mutation loginPlayer($username: String!, $password: String!) {
    loginPlayer(username: $username, password: $password) {
      id
      username
      player_name
      token
    }
  }
`;

export const REGISTER = gql`
    mutation registerPlayer($username: String!,$password: String!,$confirmPassword: String!,$player_name: String!,$email: String!,$phone: String!,$id_bank: Int!,$acc_name: String!,$acc_num: String!){
      registerPlayer(registerInput:{username: $username,password: $password,confirmPassword: $confirmPassword,player_name: $player_name,email: $email,phone: $phone,id_bank: $id_bank,acc_name: $acc_name,acc_num: $acc_num}){
            id
            username
            player_name
            token
        }
    }
`;

export const DEPOSIT = gql`
  mutation addDeposit($amount: Int!){
    addDeposit(amount: $amount){
      status
    }
  }
`;

export const WITHDRAW = gql`
  mutation addWithdraw($amount: Int!){
    addWithdraw(amount: $amount){
      status
    }
  }
`;