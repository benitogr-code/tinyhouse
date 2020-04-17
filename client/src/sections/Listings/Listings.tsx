import { gql } from "apollo-boost";
import React from "react";
import { useMutation, useQuery } from "react-apollo"
import { Listings as ListingsData } from "./__generated__/Listings";
import { DeleteListing as DeleteListingData, DeleteListingVariables} from "./__generated__/DeleteListing";

const GraphQLQuery = {
  Listings: gql`
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
  DeleteListing: gql`
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
  const [ deleteListing, deleteListingState ] = useMutation<DeleteListingData, DeleteListingVariables>(GraphQLQuery.DeleteListing);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  };

  const listings = data ? data.listings : null;
  const listingsList =
    <ul>
      {
      listings?.map((listing) => {
        return (<li key={listing.id}>
                {listing.title}
                <button onClick={() => handleDeleteListing(listing.id)}>Delete</button>
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

  const deleteListingMessage = deleteListingState.loading
    ? <h3>Deleting listing...</h3>
    : null;

  const deleteListingError = deleteListingState.error
    ? <h3>Something went wrong deleting the listing!</h3>
    : null;

  return (
    <div>
      <h2>{props.title}</h2>
      {listingsList}
      {deleteListingMessage}
      {deleteListingError}
    </div>
  );
};
