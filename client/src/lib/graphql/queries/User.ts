import { gql } from "apollo-boost";

export const User = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
      avatar
      contact
      hasWallet
      income
    }
  }
`;
