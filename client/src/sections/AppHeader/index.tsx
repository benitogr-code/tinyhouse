import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Layout, Input } from "antd";
import { MenuItems } from "./components";
import { Viewer } from "../../lib/types";
import { displayErrorMessage } from "../../lib/utils";

import logo from "./assets/tinyhouse-logo.png";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppHeader = withRouter((props: Props & RouteComponentProps) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const { pathname } = props.location;
    const pathItems = pathname.split("/");

    if (!pathname.includes("/listings")) {
      setSearch("");
    }
    else if (pathItems.length === 3){
      setSearch(pathItems[2]);
    }

  }, [props.location]);

  const onSearch = (value: string) => {
    const cleanValue = value.trim();
    const { history } = props;

    if (cleanValue) {
      history.push(`/listings/${cleanValue}`);
    }
    else {
      displayErrorMessage("Please enter a valid search");
    }
  }

  const { viewer, setViewer } = props;

  return (
    <Layout.Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img src={logo} alt="App logo" />
          </Link>
        </div>
        <div className="app-header__search-input">
          <Input.Search
            placeholder="Search 'San Francisco'"
            enterButton
            onChange={(evt) => setSearch(evt.target.value)}
            onSearch={onSearch}
            value={search}
          />
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer}/>
      </div>
    </Layout.Header>
  );
});
