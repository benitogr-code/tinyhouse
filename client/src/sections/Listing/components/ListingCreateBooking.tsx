import React from "react";
import { Button, Card, DatePicker, Divider, Tooltip, Typography } from "antd";
import moment, { Moment } from "moment";
import { BookingsIndex } from "./types";
import { Listing as ListingData } from "../../../lib/graphql/queries/__generated__/Listing";
import { displayErrorMessage, formatListingPrice } from "../../../lib/utils";
import { Viewer } from "../../../lib/types";

interface Props {
  viewer: Viewer;
  host: ListingData["listing"]["host"];
  bookingsIndex: ListingData["listing"]["bookingsIndex"];
  price: number;
  checkInDate: Moment|null;
  checkOutDate: Moment|null;
  setCheckInDate: (date: Moment|null) => void;
  setCheckOutDate: (date: Moment|null) => void;
  setModalVisible: (visible: boolean) => void;
}

export const ListingCreateBooking = (props: Props) => {
  const { price } = props;
  const { viewer, host } = props;
  const { checkInDate, setCheckInDate } = props;
  const { checkOutDate, setCheckOutDate } = props;
  const { setModalVisible } = props;

  const viewerIsHost = viewer.id === host.id;
  const disableCheckInDate = !viewer.id || viewerIsHost || !host.hasWallet;
  const disableCheckOutDate = disableCheckInDate || !checkInDate;
  const disableButton = disableCheckOutDate || !checkInDate || !checkOutDate;

  let buttonMessage = "You won't be charged yet";
  if (!viewer.id) {
    buttonMessage = "You have to be logged for booking";
  }
  else if (viewerIsHost) {
    buttonMessage = "You cannot book your own listing";
  }
  else if (!host.hasWallet) {
    buttonMessage = "The host has been disconnected from Stripe, and cannot receive payments!";
  }

  const bookingsIndex: BookingsIndex = JSON.parse(props.bookingsIndex);

  const dateIsBooked = (date: Moment) => {
    const year = date.year();
    const month = date.month();
    const day = date.date();

    if (bookingsIndex[year] && bookingsIndex[year][month]) {
      return Boolean(bookingsIndex[year][month][day]);
    }

    return false;
  };

  const isDateDisabled = (date: Moment|null) => {
    if (!date) return false;

    return date.isBefore(moment().endOf("day"))
      || date.isAfter(moment().endOf("day").add(90, "days"))
      || dateIsBooked(date);
  };

  const verifyAndSetCheckOutDate = (date: Moment|null) => {
    if (checkInDate && date) {
      if (moment(date).isBefore(checkInDate, "days")) {
        return displayErrorMessage("Check out date cannot be prior to check in!");
      }

      let dateCursor = checkInDate;
      while (moment(dateCursor).isBefore(date, "days")) {
        dateCursor = moment(dateCursor).add(1, "days");

        const year = dateCursor.year();
        const month = dateCursor.month();
        const day = dateCursor.date();

        if (bookingsIndex[year] && bookingsIndex[year][month] && bookingsIndex[year][month][day]) {
          return displayErrorMessage("You cannot book a period of time which overlaps other existing booking");
        }
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
              disabled={disableCheckInDate}
              disabledDate={isDateDisabled}
              showToday={false}
              value={checkInDate ? checkInDate : undefined}
              onChange={(date) => setCheckInDate(date)}
              onOpenChange={() => setCheckOutDate(null)}
              renderExtraFooter={() => {
                return (
                  <div>
                    <Typography.Text type="secondary" className="ant-calendar-footer-text">
                      You can only book a listing within 90 days from today.
                    </Typography.Text>
                  </div>
                );
              }}
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
              dateRender={current => {
                if (
                  moment(current).isSame(checkInDate ? checkInDate : undefined, "day")
                ) {
                  return (
                    <Tooltip title="Check in date">
                      <div className="ant-calendar-date ant-calendar-date__check-in">
                        {current.date()}
                      </div>
                    </Tooltip>
                  );
                } else {
                  return <div className="ant-calendar-date">{current.date()}</div>;
                }
              }}
              renderExtraFooter={() => {
                return (
                  <div>
                    <Typography.Text type="secondary" className="ant-calendar-footer-text">
                      Check-out cannot be before check-in.
                    </Typography.Text>
                  </div>
                );
              }}
            />
          </div>
        </div>
        <Divider />
        <Button
          disabled={disableButton}
          size="large"
          type="primary"
          className="listing-booking__card-cta"
          onClick={() => setModalVisible(true)}
        >
          Request to book!
        </Button>
        <Typography.Text type="secondary" mark>{buttonMessage}</Typography.Text>
      </Card>
    </div>
  );
};
