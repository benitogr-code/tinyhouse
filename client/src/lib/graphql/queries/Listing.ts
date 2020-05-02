import { gql } from "apollo-boost";

export const Listing = gql`
  query Listing ($id: ID!, $bookingsPage: Int!, $limit: Int!) {
    listing(id: $id) {
      id
      title
      description
      image
      host {
        id
        name
        avatar
        hasWallet
      }
      type
      address
      city
      price
      numOfGuests
      bookings(limit: $limit, page: $bookingsPage) {
        total
        result {
          id
          tenant {
            id
            name
            avatar
          }
          checkIn
          checkOut
        }
      }
      bookingsIndex
    }
  }
`;
