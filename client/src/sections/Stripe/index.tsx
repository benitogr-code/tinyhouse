import React, { useEffect, useRef } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { useMutation } from "react-apollo";
import { Layout, Spin } from "antd";
import { ConnectStripe as ConnectStripeQuery } from "../../lib/graphql/mutations";
import { ConnectStripe as ConnectStripeData, ConnectStripeVariables } from "../../lib/graphql/mutations/__generated__/ConnectStripe";
import { Viewer } from "../../lib/types";
import { displaySuccessNotification } from "../../lib/utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const Stripe = (props: Props & RouteComponentProps) => {
  const [connectStripe, { data, loading, error }] = useMutation<ConnectStripeData, ConnectStripeVariables>(
    ConnectStripeQuery,
    {
      onCompleted: (data) => {
        if (data && data.connectStripe) {
          props.setViewer({
            ...props.viewer,
            hasWallet: data.connectStripe.hasWallet
          });
          displaySuccessNotification("You've successfully connected with your Stripe account");
        }
      }
    });
  const connectStripeRef = useRef(connectStripe);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      connectStripeRef.current({
        variables: {
          input: { code }
        }
      });
    }
    else {
      props.history.replace("/login");
    }
  }, [props.history]);

  if (loading) {
    return (
      <Layout.Content className="stripe">
        <Spin size="large" tip="Connecting your Stripe account..." />
      </Layout.Content>
    );
  }

  if (error) {
    return <Redirect to={`/user/${props.viewer.id}?stripe_error=true`}/>;
  }

  if (data && data.connectStripe) {
    return <Redirect to={`/user/${props.viewer.id}`}/>;
  }

  return null;
};
