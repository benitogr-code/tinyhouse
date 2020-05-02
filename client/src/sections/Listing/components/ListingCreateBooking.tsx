import React from "react";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import moment, { Moment } from "moment";
import { displayErrorMessage, formatListingPrice } from "../../../lib/utils";

interface Props {
  price: number;
  checkInDate: Moment|null;
  checkOutDate: Moment|null;
  setCheckInDate: (date: Moment|null) => void;
  setCheckOutDate: (date: Moment|null) => void;
}

export const ListingCreateBooking = (props: Props) => {
  const { price } = props;
  const { checkInDate, setCheckInDate } = props;
  const { checkOutDate, setCheckOutDate } = props;

  const disableCheckOutDate = !checkInDate;
  const disableButton = !checkInDate || !checkOutDate;

  const isDateDisabled = (date: Moment|null) => {
    if (!date) return false;

    return date.isBefore(moment().endOf("day"));
  };

  const verifyAndSetCheckOutDate = (date: Moment|null) => {
    if (checkInDate && date) {
      if (moment(date).isBefore(checkInDate, "days")) {
        return displayErrorMessage("Check out date cannot be prior to check in!");
      }
    }

    setCheckOutDate(date);
  };

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Typography.Paragraph>
            <Typography.Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}<span>/day</span>
            </Typography.Title>
          </Typography.Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Typography.Paragraph strong>Check In</Typography.Paragraph>
            <DatePicker
              format="YYYY/MM/DD"
              disabledDate={isDateDisabled}
              showToday={false}
              value={checkInDate ? checkInDate : undefined}
              onChange={(date) => setCheckInDate(date)}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Typography.Paragraph strong>Check Out</Typography.Paragraph>
            <DatePicker
              format="YYYY/MM/DD"
              disabled={disableCheckOutDate}
              disabledDate={isDateDisabled}
              showToday={false}
              value={checkOutDate ? checkOutDate : undefined}
              onChange={(date) => verifyAndSetCheckOutDate(date)}
            />
          </div>
        </div>
        <Divider />
        <Button disabled={disableButton} size="large" type="primary" className="listing-booking__card-cta">
          Request to book!
        </Button>
      </Card>
    </div>
  );
};
