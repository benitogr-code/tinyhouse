import React from "react";
import { Card, List, Skeleton } from "antd";

import cardCoverImage from "../assets/listing-loading-card-cover.jpg";

export const ListingsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}, {}, {}, {}, {}];

  return (
    <div>
      <Skeleton paragraph={{ rows: 1 }} />
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          lg: 4
        }}
        dataSource={emptyData}
        renderItem={() => (
          <List.Item>
            <Card
              cover={
                <div
                  style={{ backgroundImage: `url(${cardCoverImage})` }}
                  className="listings-skeleton__card-cover-img"
                ></div>
              }
              loading
              className="listings-skeleton__card"
            />
          </List.Item>
        )}
      />
    </div>
  );
};
