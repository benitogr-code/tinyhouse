import React from "react";
import { List, Typography } from "antd";
import { ListingCard } from "../../../lib/components";
import { User as UserData } from "../../../lib/graphql/queries/__generated__/User";

interface Props {
  bookings: UserData["user"]["bookings"];
  limit: number;
  page: number;
  setPage: (page: number) => void;
}

export const UserBookings = (props: Props) => {
  const { bookings, setPage } = props;
  const hasBookings = bookings ? true : false;

  const userBookingsList = hasBookings
    ? (
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          lg: 4
        }}
        dataSource={bookings?.result}
        locale={{ emptyText: "You haven't made any bookings!" }}
        pagination={{
          position: "top",
          current: props.page,
          total: bookings?.total,
          defaultPageSize: props.limit,
          hideOnSinglePage: true,
          showLessItems: true,
          onChange: (page: number) => setPage(page)
        }}
        renderItem={booking => {
          const bookingHistory = (
            <div className="user-bookings__booking-history">
              <div>
                Check in: <Typography.Text strong>{booking.checkIn}</Typography.Text>
              </div>
              <div>
                Check out: <Typography.Text strong>{booking.checkOut}</Typography.Text>
              </div>
            </div>
          );

          return (
            <List.Item>
              {bookingHistory}
              <ListingCard listing={booking.listing} />
            </List.Item>
          );
        }}
      />
    )
    : null;

  const userBookingsElement = userBookingsList ? (
    <div className="user-bookings">
      <Typography.Title level={4} className="user-bookings__title">
        Bookings
      </Typography.Title>
      <Typography.Paragraph className="user-bookings__description">
        This section highlights the bookings you've made, and the check-in/check-out dates
        associated with said bookings.
      </Typography.Paragraph>
      {userBookingsList}
    </div>
  ) : null;

  return userBookingsElement;
};
