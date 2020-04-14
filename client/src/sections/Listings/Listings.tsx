import React from "react";
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
    const { data } = await server.fetch({ query: GraphQLQuery.Listings });
    console.log(data);
  };

  return (
    <div>
      <h2>{props.title}</h2>
      <button onClick={fetchListings}>Query Listings!</button>
    </div>
  );
};
