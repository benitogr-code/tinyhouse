import React from "react";
import { DeleteListingData, DeleteListingVariables, ListingsData } from "./types";
import { server, useQuery } from "../../lib/api"

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
  const { data, loading, error, refetch } = useQuery<ListingsData>(GraphQLQuery.Listings);

  const deleteListing = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: GraphQLQuery.DeleteListing,
      variables: {
        id
      }
    });

    refetch();
  };

  const listings = data ? data.listings : null;
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

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (error) {
    return <h2>Something went wrong! Please, try again later...</h2>
  }

  return (
    <div>
      <h2>{props.title}</h2>
      {listingsList}
    </div>
  );
};
