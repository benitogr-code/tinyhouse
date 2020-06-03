import React, { Fragment } from "react";
import { useMutation } from "react-apollo";
import { Avatar, Button, Card, Divider, Tag, Typography } from "antd";
import { User as UserData } from "../../../lib/graphql/queries/__generated__/User";
import { DisconnectStripe as DisconnectStripeQuery } from "../../../lib/graphql/mutations";
import { DisconnectStripe as DisconnectStripeData } from "../../../lib/graphql/mutations/__generated__/DisconnectStripe";
import { displayErrorMessage, displaySuccessNotification, formatListingPrice } from "../../../lib/utils";
import { Viewer } from "../../../lib/types";

interface Props {
  user: UserData["user"];
  refetchUser: () => Promise<void>;
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
  viewerIsUser: boolean;
}

const { REACT_APP_STRIPE_CLIENT_ID } = process.env;
const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${REACT_APP_STRIPE_CLIENT_ID}&scope=read_write`;

export const UserProfile = (props: Props) => {
  const { user, viewer, setViewer, viewerIsUser, refetchUser } = props;
  const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(
    DisconnectStripeQuery,
    {
      onCompleted: (data) => {
        if (data && data.disconnectStripe) {
          setViewer({
            ...viewer,
            hasWallet: data.disconnectStripe.hasWallet
          });
          displaySuccessNotification("You've successfully disconnected from Stripe.");
          refetchUser();
        }
      },
      onError: () => {
        displayErrorMessage("Sorry, we were not able to disconnect your Stripe account. Please, try again later.");
      }
    }
    );

  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl;
  }

  const walletDetails = user.hasWallet
    ? (
      <Fragment>
        <Typography.Paragraph>
          <Tag color="green">Stripe Registered</Tag>
        </Typography.Paragraph>
        <Typography.Paragraph>
          Income Earned:{" "}
          <Typography.Text strong>{user.income ? formatListingPrice(user.income) : `$0`}</Typography.Text>
        </Typography.Paragraph>
        <Button
          type="primary"
          className="user-profile__details-cta"
          loading={loading}
          onClick={() => disconnectStripe()}>
          Disconnect Stripe
        </Button>
        <Typography.Paragraph type="secondary">
          By disconnecting, you won't be able to receive{" "}
          <Typography.Text strong>any further payments</Typography.Text>. This will prevent users from booking
          listings that you might have already created.
        </Typography.Paragraph>
      </Fragment>
    )
    : (
      <Fragment>
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
      </Fragment>
    );

  const additionalDetails = viewerIsUser ? (
    <Fragment>
      <Divider />
      <div className="user-profile__details">
        <Typography.Title level={4}>Additional Details</Typography.Title>
        {walletDetails}
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
