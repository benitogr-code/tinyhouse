import { Alert, Avatar, Button, List, Spin } from "antd";
import { gql } from "apollo-boost";
import React from "react";
import { useMutation, useQuery } from "react-apollo";
import { ListingsSkeleton } from "./components";
import "./styles/Listings.css";
import { DeleteListing as DeleteListingData, DeleteListingVariables } from "./__generated__/DeleteListing";
import { Listings as ListingsData } from "./__generated__/Listings";

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
  const listingsList = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item actions={[<Button type="primary" onClick={() => handleDeleteListing(listing.id)}>Delete</Button>]}>
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48}></Avatar>}
          />
        </List.Item>
      )}
    />
  ) : null;

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={props.title}/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={props.title} error/>
      </div>
    );
  }

  const deleteListingErrorAlert = deleteListingState.error
    ? <Alert className="listings__alert" type="error" message="Something went wrong deleting the listing!"/>
    : null;

  return (
    <div className="listings">
      <Spin spinning={deleteListingState.loading}>
        {deleteListingErrorAlert}
        <h2>{props.title}</h2>
        {listingsList}
      </Spin>
    </div>
  );
};
