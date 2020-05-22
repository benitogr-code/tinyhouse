import React, { useEffect, useRef, useState } from "react";
import { Affix, Layout, Spin } from "antd";
import ApolloClient from "apollo-boost";
import { ApolloProvider, useMutation } from "react-apollo";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";
import { LogIn as LogInQuery } from "./lib/graphql/mutations";
import { LogIn as LogInData, LogInVariables } from "./lib/graphql/mutations/__generated__/LogIn";
import { Viewer } from "./lib/types";
import {
  AppHeader, Home, Host, Listing, Listings, Login, NotFound, Stripe, User
} from "./sections";
import * as serviceWorker from "./serviceWorker";
import "./styles/index.css";

const client = new ApolloClient({
  uri: "/api",
  request: (operation) => {
    const token = sessionStorage.getItem("token");
    operation.setContext({
      headers: {
        "X-CSRF-TOKEN": token || "",
      }
    });
  },
});

const App = () => {
  const [viewer, setViewer] = useState<Viewer>({
    id: null,
    token: null,
    avatar: null,
    hasWallet: null,
    didRequest: false
  });

  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LogInQuery, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        }
        else {
          sessionStorage.removeItem("token");
        }
      }
    }
  });
  const logInRef = useRef(logIn);

  // Login on mount
  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching Tinyhouse" />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error
  ? <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  : null;

  return (
    <BrowserRouter>
      <Layout id="app">
        {logInErrorBannerElement}
        <Affix offsetTop={0} className="app__affix-header">
          <div>
          <AppHeader viewer={viewer} setViewer={setViewer}/>
          </div>
        </Affix>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/host"
            render={props => <Host {...props} viewer={viewer} />} />
          <Route exact path="/listing/:id" component={Listing} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route
            exact
            path="/login"
            render={props => <Login {...props} setViewer={setViewer} />} />
          <Route
            exact
            path="/stripe"
            render={props => <Stripe {...props} viewer={viewer} setViewer={setViewer} />} />
          <Route
            exact
            path="/user/:id"
            render={props => <User {...props} viewer={viewer} setViewer={setViewer}></User>} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider> ,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
