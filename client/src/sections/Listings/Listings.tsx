import React from "react";

interface Props {
  title: string;
}

export const Listings = (props: Props) => {
  return <h2>{props.title}</h2>;
};
