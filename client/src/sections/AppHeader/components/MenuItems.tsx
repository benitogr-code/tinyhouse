import React from "react";
import { Link } from "react-router-dom";
import { useMutation } from "react-apollo";
import { Button, Icon, Menu, Avatar } from "antd";
import { LogOut as LogOutQuery } from "../../../lib/graphql/mutations";
import { LogOut as LogOutData } from "../../../lib/graphql/mutations/__generated__/LogOut";
import { Viewer } from "../../../lib/types";
import { displaySuccessNotification, displayErrorMessage } from "../../../lib/utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(
    LogOutQuery,
    {
      onCompleted: (data) => {
        if (data && data.logOut) {
          setViewer(data.logOut);
          sessionStorage.removeItem("token");
          displaySuccessNotification("You've successfully logged out!");
        }
      },
      onError: (_error) => {
        displayErrorMessage("Sorry, we could not log you out! Please, try again later.");
      }
    }
  );

  const handleLogOut = () => {
    logOut();
  }

  const avatarUrl = viewer.avatar || "";
  const subMenuLogin = viewer.id
  ? (
    <Menu.SubMenu title={<Avatar src={avatarUrl}/>}>
      <Menu.Item key="/user">
        <Link to={`/user/${viewer.id}`}>
          <Icon type="user" />
          Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="/logout">
        <div onClick={handleLogOut}>
          <Icon type="logout" />
          Log Out
        </div>
      </Menu.Item>
    </Menu.SubMenu>
    )
  : (
    <Menu.Item>
      <Link to="/login">
        <Button type="primary">Sign In</Button>
      </Link>
    </Menu.Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Menu.Item key="/host">
        <Link to="/host">
          <Icon type="home" />
          Host
        </Link>
      </Menu.Item>
      {subMenuLogin}
    </Menu>
  );
};
