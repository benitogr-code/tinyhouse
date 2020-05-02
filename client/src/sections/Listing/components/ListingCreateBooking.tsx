import React from "react";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import { formatListingPrice } from "../../../lib/utils";

interface Props {
  price: number;
}

export const ListingCreateBooking = (props: Props) => {
  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Typography.Paragraph>
            <Typography.Title level={2} className="listing-booking__card-title">
              {formatListingPrice(props.price)}<span>/day</span>
            </Typography.Title>
          </Typography.Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Typography.Paragraph strong>Check In</Typography.Paragraph>
            <DatePicker />
          </div>
          <div className="listing-booking__card-date-picker">
            <Typography.Paragraph strong>Check Out</Typography.Paragraph>
            <DatePicker />
          </div>
        </div>
        <Divider />
        <Button size="large" type="primary" className="listing-booking__card-cta">
          Request to book!
        </Button>
      </Card>
    </div>
  );
};
