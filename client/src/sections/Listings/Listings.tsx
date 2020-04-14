import React from "react";
import { ListingsData } from "./types";
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
};

interface Props {
  title: string;
}

export const Listings = (props: Props) => {
  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: GraphQLQuery.Listings });
    console.log(data);
  };

  return (
    <div>
      <h2>{props.title}</h2>
      <button onClick={fetchListings}>Query Listings!</button>
    </div>
  );
};
