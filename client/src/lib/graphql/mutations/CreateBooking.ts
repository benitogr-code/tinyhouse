import { gql } from "apollo-boost";

export const CreateBooking = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
    }
  }
`;
