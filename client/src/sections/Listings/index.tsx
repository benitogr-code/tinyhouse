import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Affix, Layout, List, Typography } from "antd";
import { ListingsFilters, ListingsPagination, ListingsSkeleton } from "./components";
import { ErrorBanner, ListingCard } from "../../lib/components";
import { Listings as ListingsQuery } from "../../lib/graphql/queries";
import { Listings as ListingsData, ListingsVariables } from "../../lib/graphql/queries/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { useScrollToTop } from "../../lib/hooks";

interface MatchParams {
  location: string;
}

export const Listings = (props: RouteComponentProps<MatchParams>) => {
  const pageLimit = 8;

  const locationRef = useRef(props.match.params.location);
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);

  const { data, error, loading } = useQuery<ListingsData, ListingsVariables>(ListingsQuery, {
    skip: ((locationRef.current !== props.match.params.location) && (page !== 1)),
    variables: {
      location: props.match.params.location,
      filter,
      limit: pageLimit,
      page
    }
  });

  useEffect(() => {
    setPage(1);
    locationRef.current = props.match.params.location;
  }, [props.match.params.location]);

  useScrollToTop();

  if (loading) {
    return (
      <Layout.Content className="listings">
        <ListingsSkeleton />
      </Layout.Content>
    );
  }

  if (error) {
    return (
      <Layout.Content className="listings">
        <ErrorBanner description="We either couldn't find the location you were searching for or encountered an error."/>
        <ListingsSkeleton />
      </Layout.Content>
    );
  }

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsRegionElement = listingsRegion ? (
    <Typography.Title level={3} className="listings__title">
      Results for "{listingsRegion}"
    </Typography.Title>
  ) : null;

  const listingsSectionElement = listings && listings.result.length ? (
    <div>
      <Affix offsetTop={64}>
        <div>
        <ListingsPagination total={listings.total} page={page} limit={pageLimit} setPage={setPage}/>
        <ListingsFilters filter={filter} setFilter={setFilter} />
        </div>
      </Affix>
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
    </div>
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
