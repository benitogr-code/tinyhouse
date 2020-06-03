import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Divider, Icon, Tag, Typography } from "antd";
import { Listing as ListingData } from "../../../lib/graphql/queries/__generated__/Listing";
import { iconColor } from "../../../lib/utils";

interface Props {
  listing: ListingData["listing"];
}

export const ListingDetails = (props: Props) => {
  const { listing } = props;

  return (
    <div className="listing-details">
      <div
        style={{ backgroundImage: `url(${listing.image})` }}
        className="listing-details__image"
      />

      <div className="listing-details__information">
        <Typography.Paragraph type="secondary" ellipsis className="listing-details__city-address">
          <Link to={`/listings/${listing.city}`}>
            <Icon type="environment" style={{ color: iconColor }} /> {listing.city}
          </Link>
          <Divider type="vertical" />
          {listing.address}
        </Typography.Paragraph>
        <Typography.Title level={3} className="listing-details__title">
          {listing.title}
        </Typography.Title>
      </div>

      <Divider />

      <div className="listing-details__section">
        <Link to={`/user/${listing.host.id}`}>
          <Avatar src={listing.host.avatar} size={64} />
          <Typography.Title level={2} className="listing-details__host-name">
            {listing.host.name}
          </Typography.Title>
        </Link>
      </div>

      <Divider />

      <div className="listing-details__section">
        <Typography.Title level={4}>About this space</Typography.Title>
        <div className="listing-details__about-items">
          <Tag color="magenta">{listing.type}</Tag>
          <Tag color="magenta">{listing.numOfGuests} Guests</Tag>
        </div>
        <Typography.Paragraph ellipsis={{ rows: 3, expandable: true }}>{listing.description}</Typography.Paragraph>
      </div>
    </div>
  );
};
