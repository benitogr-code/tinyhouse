import React from "react";
import { List, Typography } from "antd";
import { ListingCard } from "../../../lib/components";
import { User as UserData } from "../../../lib/graphql/queries/__generated__/User";

interface Props {
  listings: UserData["user"]["listings"];
  limit: number;
  page: number;
  setPage: (page: number) => void;
}

export const UserListings = (props: Props) => {
  const { listings, setPage } = props;

  const userListingsList = (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 4
      }}
      dataSource={listings.result}
      locale={{ emptyText: "User doesn't have any listings yet!" }}
      pagination={{
        position: "top",
        current: props.page,
        total: listings.total,
        defaultPageSize: props.limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setPage(page)
      }}
      renderItem={listing => (
        <List.Item>
          <ListingCard listing={listing} />
        </List.Item>
      )}
    />
  );

  return (
    <div className="user-listings">
      <Typography.Title level={4} className="user-listings__title">
        Listings
      </Typography.Title>
      <Typography.Paragraph className="user-listings__description">
        This section highlights the listings this user currently hosts and has
        made available for bookings.
      </Typography.Paragraph>
      {userListingsList}
    </div>
  );
}
