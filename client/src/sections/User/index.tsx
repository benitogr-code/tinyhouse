import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Layout, Col, Row } from "antd";
import { useQuery } from "react-apollo";
import { UserProfile } from "./components";
import { User as UserQuery } from "../../lib/graphql/queries";
import { User as UserData, UserVariables } from "../../lib/graphql/queries/__generated__/User";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { Viewer } from "../../lib/types";

interface Props {
  viewer: Viewer;
}

interface MatchParams {
  id: string;
}

export const User = ({ viewer, match }: Props & RouteComponentProps<MatchParams>) => {
  const { data, loading, error } = useQuery<UserData, UserVariables>(UserQuery, {
    variables: {
      id: match.params.id
    }
  });

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
  const userProfileElement = user ? <UserProfile user={user} viewerIsUser={viewerIsUser} /> : null;

  return (
    <Layout.Content className="user">
      <Row gutter={12} type="flex" justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Layout.Content>
  );
};
