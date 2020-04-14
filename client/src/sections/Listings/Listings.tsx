import React from "react";
import { DeleteListingData, DeleteListingVariables, ListingsData } from "./types";
import { server } from "../../lib/api"

const GraphQLQuery = {
  Listings: `
    query Listings {
      listings {
        id
        title
        image
        address
        price
        numOfGuests
        numOfBeds
        numOfBaths
        rating
      }
    }
  `,
  DeleteListing: `
    mutation DeleteListing($id: ID!) {
      deleteListing(id: $id) {
        id
      }
    }
  `
};

interface Props {
  title: string;
}

export const Listings = (props: Props) => {
  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: GraphQLQuery.Listings });
    console.log("Fetch listings:", data);
  };

  const deleteListing = async () => {
    const { data } = await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: GraphQLQuery.DeleteListing,
      variables: {
        id: "xxx",
      }
    });
    console.log("Delete listings", data);
  };

  return (
    <div>
      <h2>{props.title}</h2>
      <button onClick={fetchListings}>Query Listings!</button>
      <button onClick={deleteListing}>Delete Listing!</button>
    </div>
  );
};
