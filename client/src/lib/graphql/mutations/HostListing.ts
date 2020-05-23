import { gql } from "apollo-boost";

export const HostListing = gql`
  mutation HostListing($input: HostListingInput!) {
    hostListing(input: $input) {
      id
    }
  }
`;
