import React from "react";
import { Pagination } from "antd";

interface Props {
  total: number;
  page: number;
  limit: number;
  setPage: (page: number) => void;
}

export const ListingsPagination = (props: Props) => {
  return (
    <Pagination
      current={props.page}
      total={props.total}
      defaultPageSize={props.limit}
      hideOnSinglePage
      showLessItems
      onChange={(page: number) => props.setPage(page)}
      className="listings-pagination"
    />
  );
};
