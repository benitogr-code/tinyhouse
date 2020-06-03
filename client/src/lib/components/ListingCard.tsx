import React from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Typography } from "antd";
import { formatListingPrice, iconColor } from "../../lib/utils";

interface Props {
  listing: {
    id: string;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
  };
}

export const ListingCard = (props: Props) => {
  const { listing } = props;

  return (
    <Link to={`/listing/${listing.id}`}>
      <Card
        hoverable
        cover={
          <div
            style={{ backgroundImage: `url(${listing.image})` }}
            className="listing-card__cover-img"
          />
        }
      >
        <div className="listing-card__details">
          <div className="listing-card__description">
            <Typography.Title level={4} className="listing-card__price">
              {formatListingPrice(listing.price)}
              <span>/day</span>
            </Typography.Title>
            <Typography.Text strong ellipsis className="listing-card__title">
              {listing.title}
            </Typography.Text>
            <Typography.Text ellipsis className="listing-card__address">
              {listing.address}
            </Typography.Text>
          </div>
          <div className="listing-card__dimensions listing-card__dimensions--guests">
            <Icon type="user" style={{ color: iconColor }}/>
            <Typography.Text>{listing.numOfGuests} guests</Typography.Text>
          </div>
        </div>
      </Card>
    </Link>
  );
};
