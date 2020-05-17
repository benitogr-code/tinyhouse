import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Layout, List, Typography } from "antd";
import { ListingCard } from "../../lib/components";
import { Listings as ListingsQuery } from "../../lib/graphql/queries";
import { Listings as ListingsData, ListingsVariables } from "../../lib/graphql/queries/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";

interface MatchParams {
  location: string;
}

export const Listings = (props: RouteComponentProps<MatchParams>) => {
  const { data } = useQuery<ListingsData, ListingsVariables>(ListingsQuery, {
    variables: {
      location: props.match.params.location,
      filter: ListingsFilter.PRICE_LOW_TO_HIGH,
      limit: 8,
      page: 1
    }
  });

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsRegionElement = listingsRegion ? (
    <Typography.Title level={3} className="listings__title">
      Results for "{listingsRegion}"
    </Typography.Title>
  ) : null;

  const listingsSectionElement = listings && listings.result.length ? (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 4
      }}
      dataSource={listings.result}
      renderItem={listing => (
        <List.Item>
          <ListingCard listing={listing} />
        </List.Item>
      )}
    />
  ) : (
    <div>
      <Typography.Paragraph>
        It appears that no listings have yet been created for{" "}
        <Typography.Text mark>"{listingsRegion}"</Typography.Text>
      </Typography.Paragraph>
      <Typography.Paragraph>
        Be the first person to create a <Link to="/host">listing in this area</Link>!
      </Typography.Paragraph>
    </div>
  );

  return (
    <Layout.Content className="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Layout.Content>
    );
};
