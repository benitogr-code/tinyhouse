import { gql } from "apollo-boost";

export const ConnectStripe = gql`
  mutation ConnectStripe($input: ConnectStripeInput!) {
    connectStripe(input: $input) {
      hasWallet
    }
  }
`;
