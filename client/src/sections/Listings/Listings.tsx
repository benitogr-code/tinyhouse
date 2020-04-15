import React, { useState } from "react";
import { DeleteListingData, DeleteListingVariables, Listing, ListingsData } from "./types";
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
  const [ listings, setListings ] = useState<Listing[]|null>(null);

  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: GraphQLQuery.Listings });
    setListings(data.listings);
  };

  const deleteListing = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: GraphQLQuery.DeleteListing,
      variables: {
        id
      }
    });

    fetchListings();
  };

  const listingsList =
    <ul>
      {
      listings?.map((listing) => {
        return (<li key={listing.id}>
                {listing.title}
                <button onClick={() => deleteListing(listing.id)}>Delete</button>
              </li>);
      })
      }
    </ul>

  return (
    <div>
      <h2>{props.title}</h2>
      {listingsList}
      <button onClick={fetchListings}>Query Listings!</button>
    </div>
  );
};
