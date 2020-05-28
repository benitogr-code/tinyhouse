import React from "react";
import { Button, Divider, Icon, Typography, Modal } from "antd";
import { Moment } from "moment";
import { formatListingPrice } from "../../../lib/utils";

interface Props {
  price: number;
  checkInDate: Moment;
  checkOutDate: Moment;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const ListingCreateBookingModal = (props: Props) => {
  const bookedDays = props.checkOutDate.diff(props.checkInDate, "days") + 1;
  const listingPrice = props.price * bookedDays;

  return (
    <Modal
      visible={props.visible}
      centered
      footer={null}
      onCancel={() => props.setVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Typography.Title className="listing-boooking-modal__intro-title">
            <Icon type="key"></Icon>
          </Typography.Title>
          <Typography.Title level={3} className="listing-boooking-modal__intro-title">
            Book your trip
          </Typography.Title>
          <Typography.Paragraph>
            Enter your payment information to book the listing from the dates between{" "}
            <Typography.Text mark strong>
              {props.checkInDate.format("MMMM Do YYYY")}
            </Typography.Text>
            {" "}and{" "}
            <Typography.Text mark strong>
              {props.checkOutDate.format("MMMM Do YYYY")}
            </Typography.Text>
            , inclusive.
          </Typography.Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__charge-summary">
          <Typography.Paragraph>
            {formatListingPrice(props.price, false)} * {bookedDays} days ={" "}
            <Typography.Text strong>{formatListingPrice(listingPrice, false)}</Typography.Text>
          </Typography.Paragraph>
          <Typography.Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Typography.Text mark>{formatListingPrice(listingPrice, false)}</Typography.Text>
          </Typography.Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__stripe-card-section">
          <Button size="large" type="primary" className="listing-booking-modal__cta">
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};
