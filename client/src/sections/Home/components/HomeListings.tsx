import React from "react";
import { List, Typography } from "antd";
import { ListingCard } from "../../../lib/components";
import { Listings } from "../../../lib/graphql/queries/__generated__/Listings";

interface Props {
  title: string;
  listings: Listings["listings"]["result"];
}

export const HomeListings = (props: Props) => {
  return (
    <div className="home-listings">
      <Typography.Title level={4} className="home-listings__title">
        {props.title}
      </Typography.Title>
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          lg: 4
        }}
        dataSource={props.listings}
        renderItem={listing => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    </div>
  );
};
