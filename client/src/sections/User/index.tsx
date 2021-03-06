import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Layout, Col, Row } from "antd";
import { useQuery } from "react-apollo";
import { UserBookings, UserListings, UserProfile } from "./components";
import { User as UserQuery } from "../../lib/graphql/queries";
import { User as UserData, UserVariables } from "../../lib/graphql/queries/__generated__/User";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { useScrollToTop } from "../../lib/hooks";
import { Viewer } from "../../lib/types";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

interface MatchParams {
  id: string;
}

export const User = (props: Props & RouteComponentProps<MatchParams>) => {
  const pageLimit = 4;
  const { viewer, setViewer, match } = props;
  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);

  const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(UserQuery, {
    variables: {
      id: match.params.id,
      bookingsPage,
      listingsPage,
      limit: pageLimit
    },
    fetchPolicy: "cache-and-network"
  });

  const handleUserRefetch = async () => {
    await refetch();
  };

  useScrollToTop();

  const stripeError = new URL(window.location.href).searchParams.get("stripe_error");
  const stripeErrorBanner = stripeError
    ? <ErrorBanner description="We had an issue with Stripe. Please try again later."/>
    : null;

  if (loading) {
    return (
      <Layout.Content className="user">
        <PageSkeleton />
      </Layout.Content>
    );
  }

  if (error) {
    return (
      <Layout.Content className="user">
        <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Layout.Content>
    );
  }

  const user = data ? data.user : null;
  const viewerIsUser = user ? user.id === viewer.id : false;
  const userProfileElement = user ? <UserProfile user={user} viewer={viewer} setViewer={setViewer} viewerIsUser={viewerIsUser} refetchUser={handleUserRefetch}/> : null;

  const userListingsElement = user && user.listings
    ? <UserListings listings={user.listings} page={listingsPage} limit={pageLimit} setPage={setListingsPage} />
    : null;

  const userBookingsElement = user && user.bookings
    ? <UserBookings bookings={user.bookings} page={bookingsPage} limit={pageLimit} setPage={setBookingsPage} />
    : null;

  return (
    <Layout.Content className="user">
      {stripeErrorBanner}
      <Row gutter={12} type="flex" justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
        <Col xs={24}>
          {userListingsElement}
          {userBookingsElement}
        </Col>
      </Row>
    </Layout.Content>
  );
};
