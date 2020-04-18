import { Alert, Divider, Skeleton } from "antd";
import React from "react";
import "./styles/ListingsSkeleton.css";

interface Props {
  title: string;
  error?: boolean;
}

export const ListingsSkeleton = (props: Props) => {
  const errorAlert = props.error
    ? <Alert className="listings-skeleton__alert" type="error" message="Something went wrong! Please, try again later..."/>
    : null;

  return (
    <div className="listings-skeleton">
      {errorAlert}
      <h2>{props.title}</h2>
      <Skeleton active paragraph={{ rows: 1 }}/>
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }}/>
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }}/>
    </div>
  );
};
