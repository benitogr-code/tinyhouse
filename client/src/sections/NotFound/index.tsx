import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Empty, Layout, Typography } from "antd";

export const NotFound = () => {
  return (
    <Layout.Content className="not-found">
      <Empty
        description={
          <Fragment>
            <Typography.Text className="not-found__description-title">
              Uh oh! Something went wrong :(
            </Typography.Text>
            <Typography.Text className="not-found__description-subtitle">
              The page you're looking for can't be found
            </Typography.Text>
          </Fragment>
        }
      />
      <Link to="/" className="not-found__cta ant-btn ant-btn-primary ant-btn-lg">
        Go to Home
      </Link>
    </Layout.Content>
  );
};
