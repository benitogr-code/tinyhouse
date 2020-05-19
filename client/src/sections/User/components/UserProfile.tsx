import React, { Fragment } from "react";
import { Avatar, Button, Card, Divider, Typography } from "antd";
import { User as UserData } from "../../../lib/graphql/queries/__generated__/User";

interface Props {
  user: UserData["user"];
  viewerIsUser: boolean;
}

const { REACT_APP_STRIPE_CLIENT_ID } = process.env;
const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${REACT_APP_STRIPE_CLIENT_ID}&scope=read_write`;

export const UserProfile = (props: Props) => {
  const { user, viewerIsUser } = props;

  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl;
  }

  const additionalDetails = viewerIsUser ? (
    <Fragment>
      <Divider />
      <div className="user-profile__details">
        <Typography.Title level={4}>Additional Details</Typography.Title>
        <Typography.Paragraph>
          Interested in becoming a TinyHouse host? Register with your Stripe account!
        </Typography.Paragraph>
        <Button type="primary" className="user-profile__details-cta" onClick={redirectToStripe}>
          Connect with Stripe!
        </Button>
        <Typography.Paragraph type="secondary">
          TinyHouse uses{" "}
          <a href="https://stripe.com/en-US/connect" target="_blank" rel="noopener noreferrer">
            Stripe
          </a>{" "}to help transfer your earnings in a secure and trusted manner.
        </Typography.Paragraph>
      </div>
    </Fragment>
  ) : null;

  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={user.avatar} />
        </div>
        <Divider />
        <div className="user-profile__details">
          <Typography.Title level={4}>Details</Typography.Title>
          <Typography.Paragraph>
            Name: <Typography.Text strong>{user.name}</Typography.Text>
          </Typography.Paragraph>
          <Typography.Paragraph>
            Contact: <Typography.Text strong>{user.contact}</Typography.Text>
          </Typography.Paragraph>
        </div>
        {additionalDetails}
      </Card>
    </div>
  );
}
