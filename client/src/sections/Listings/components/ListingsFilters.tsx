import React from "react";
import { Select } from "antd";
import { ListingsFilter } from "../../../lib/graphql/globalTypes";

interface Props {
  filter: ListingsFilter;
  setFilter: (filter: ListingsFilter) => void;
}

export const ListingsFilters = ({ filter, setFilter }: Props) => {
  return (
    <div className="listings-filters">
      <span>Filter By</span>
      <Select value={filter} onChange={(filter: ListingsFilter) => setFilter(filter)}>
        <Select.Option value={ListingsFilter.PRICE_LOW_TO_HIGH}>Price: Low to High</Select.Option>
        <Select.Option value={ListingsFilter.PRICE_HIGH_TO_LOW}>Price: High to Low</Select.Option>
      </Select>
    </div>
  );
};
