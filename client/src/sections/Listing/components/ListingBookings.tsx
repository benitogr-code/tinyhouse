import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Divider, List, Typography } from "antd";
import { Listing } from "../../../lib/graphql/queries/__generated__/Listing";

interface Props {
  bookings: Listing["listing"]["bookings"];
  page: number;
  limit: number;
  setPage: (page: number) => void;
}

export const ListingBookings = (props: Props) => {
  const { bookings, page, limit, setPage } = props;
  const total = bookings ? bookings.total : null;
  const result = bookings ? bookings.result : null;

  const listingBookingsList = bookings ? (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 3
      }}
      dataSource={result ? result : undefined}
      locale={{ emptyText: "No bookings have been made yet!" }}
      pagination={{
        current: page,
        total: total ? total : undefined,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setPage(page)
      }}
      renderItem={booking => {
        const bookingHistory = (
          <div className="listing-bookings__history">
            <div>
              Check in: <Typography.Text strong>{booking.checkIn}</Typography.Text>
            </div>
            <div>
              Check out: <Typography.Text strong>{booking.checkOut}</Typography.Text>
            </div>
          </div>
        );

        return (
          <List.Item className="listing-bookings__item">
            {bookingHistory}
            <Link to={`/user/${booking.tenant.id}`}>
              <Avatar src={booking.tenant.avatar} size={64} shape="square" />
            </Link>
          </List.Item>
        );
      }}
    />
  ) : null;

  const listingBookingsElement = listingBookingsList ? (
    <div className="listing-bookings">
      <Divider />
      <div className="listing-bookings__section">
        <Typography.Title level={4}>Bookings</Typography.Title>
      </div>
      {listingBookingsList}
    </div>
  ) : null;

  return listingBookingsElement;
};
