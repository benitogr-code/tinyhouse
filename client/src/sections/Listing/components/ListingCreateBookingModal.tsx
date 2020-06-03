import React from "react";
import { useMutation } from "react-apollo";
import { CardElement, injectStripe, ReactStripeElements } from "react-stripe-elements";
import { Button, Divider, Icon, Typography, Modal } from "antd";
import { Moment } from "moment";
import { CreateBooking as CreateBookingQuery } from "../../../lib/graphql/mutations";
import { CreateBooking as CreateBookingData, CreateBookingVariables } from "../../../lib/graphql/mutations/__generated__/CreateBooking";
import { displayErrorMessage, displaySuccessNotification, formatListingPrice } from "../../../lib/utils";

interface Props {
  id: string;
  price: number;
  checkInDate: Moment;
  checkOutDate: Moment;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  clearBookingData: () => void;
  refetchListing: () => Promise<void>;
}

const ListingCreateBookingModal = (props: Props & ReactStripeElements.InjectedStripeProps) => {
  const bookedDays = props.checkOutDate.diff(props.checkInDate, "days") + 1;
  const listingPrice = props.price * bookedDays;

  const [createBooking, { loading }] = useMutation<CreateBookingData, CreateBookingVariables>(
    CreateBookingQuery,
    {
      onCompleted: () => {
        const { clearBookingData, refetchListing } = props;
        clearBookingData();
        displaySuccessNotification(
          "You have successfully booked the listing!",
          "Booking history can always be found in your User page."
        );
        refetchListing();
      },
      onError: () => {
        displayErrorMessage("Sorry! We weren't able to successfully book the listing. Please try again later.");
      }
    });

  const handleCreateBooking = async () => {
    if (!props.stripe) {
      displayErrorMessage("Sorry! We weren't able to connect with Stripe.");
      return;
    }

    const { stripe } = props;
    const { token, error } = await stripe.createToken();

    if (token) {
      createBooking({
        variables: {
          input: {
            id: props.id,
            source: token.id,
            checkIn: props.checkInDate.format("YYYY-MM-DD"),
            checkOut: props.checkOutDate.format("YYYY-MM-DD"),
          }
        }
      })
    }
    else {
      const errMessage = error && error.message ? error.message : "Sorry! We weren't able to book the listing. Please try again later.";
      displayErrorMessage(errMessage);
    }
  }

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
          <CardElement hidePostalCode className="listing-booking-modal__stripe-card"/>
          <Button size="large" type="primary" loading={loading} className="listing-booking-modal__cta" onClick={handleCreateBooking}>
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const WrappedListingCreateBookingModal = injectStripe(ListingCreateBookingModal);
