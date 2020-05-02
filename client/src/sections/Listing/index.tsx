import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "react-apollo";
import { Col, Layout, Row } from "antd";
import { ListingBookings, ListingCreateBooking, ListingDetails } from "./components";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { Listing as ListingQuery } from "../../lib/graphql/queries";
import { Listing as ListingData, ListingVariables } from "../../lib/graphql/queries/__generated__/Listing";

interface MatchParams {
  id: string;
}

export const Listing = (props: RouteComponentProps<MatchParams>) => {
  const pageLimit = 3;
  const [bookingsPage, setBookingsPage] = useState(1);

  const { data, loading, error } = useQuery<ListingData, ListingVariables>(ListingQuery, {
    variables: {
      id: props.match.params.id,
      bookingsPage,
      limit: pageLimit
    }
  });

  if (loading) {
    return (
      <Layout.Content className="listings">
        <PageSkeleton />
      </Layout.Content>
    );
  }

  if (error) {
    return (
      <Layout.Content className="listings">
        <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon!" />
        <PageSkeleton />
      </Layout.Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  const listingDetailsElement = listing ? <ListingDetails listing={listing} /> : null;
  const listingBookingsElement = listingBookings
  ? (
    <ListingBookings
      bookings={listingBookings}
      page={bookingsPage}
      limit={pageLimit}
      setPage={setBookingsPage}
    />
  )
  : null;

  const listingCreateBookingElement = listing ? <ListingCreateBooking price={listing.price}/> : null;

  return (
    <Layout.Content className="listings">
      <Row gutter={24} type="flex" justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBookingElement}
        </Col>
      </Row>
    </Layout.Content>
  );
};
