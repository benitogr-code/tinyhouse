import { gql } from "apollo-boost";

export const DisconnectStripe = gql`
  mutation DisconnectStripe {
    disconnectStripe {
      hasWallet
    }
  }
`;
