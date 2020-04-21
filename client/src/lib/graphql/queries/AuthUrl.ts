import { gql } from "apollo-boost";

export const AuthUrl = gql`
  query AuthUrl {
    authUrl
  }
`;
