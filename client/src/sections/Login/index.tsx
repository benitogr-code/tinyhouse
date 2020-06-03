import React, { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { Card, Layout, Spin, Typography } from "antd";
import { useApolloClient, useMutation } from "react-apollo";
import googleLogo from "./assets/google_logo.jpg";
import { ErrorBanner } from "../../lib/components";
import { LogIn as LogInQuery } from "../../lib/graphql/mutations";
import { LogIn as LogInData, LogInVariables } from "../../lib/graphql/mutations/__generated__/LogIn";
import { AuthUrl as AuthUrlQuery } from "../../lib/graphql/queries";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/__generated__/AuthUrl";
import { useScrollToTop } from "../../lib/hooks";
import { Viewer } from "../../lib/types";
import { displaySuccessNotification, displayErrorMessage } from "../../lib/utils";

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = (props: Props) => {
  const client = useApolloClient();
  const { setViewer } = props;

  // Creates logIn mutation and updates 'viewer' upon success
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError }
  ] = useMutation<LogInData, LogInVariables>(
    LogInQuery,
    {
      onCompleted: (data) => {
        if (data && data.logIn && data.logIn.token) {
          setViewer(data.logIn);
          sessionStorage.setItem("token", data.logIn.token);
          displaySuccessNotification("You are logged in!");
        }
      }
    });
  const logInRef = useRef(logIn);

  // On mount check if we have an auth code to do the login
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      logInRef.current({
        variables: {
          input: { code }
        }
      });
    }
  }, []);

  useScrollToTop();

  // Get authUrl and redirects to it
  const handleAuthorize = async () => {
    try {
      const result = await client.query<AuthUrlData>({ query: AuthUrlQuery });
      window.location.href = result.data.authUrl;
    }
    catch {
      displayErrorMessage("Sorry! We weren't able to log you in. Please try again later!")
    }
  };

  // Render JSXElements

  if (logInLoading) {
    return (
      <Layout.Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Layout.Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!" />
  ) : null;

  return (
    <Layout.Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Typography.Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Typography.Title>
          <Typography.Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Typography.Title>
          <Typography.Text>Sign in with Google to start booking available rentals!</Typography.Text>
        </div>
        <button className="log-in-card__google-button" onClick={handleAuthorize}>
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">Sign in with Google</span>
        </button>
        <Typography.Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form to sign in
          with your Google account.
        </Typography.Text>
      </Card>
    </Layout.Content>
  );
};
