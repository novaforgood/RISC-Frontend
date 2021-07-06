import React, { ReactElement, useState } from "react";
import { Card, Text } from "./atomic";
import classNames from "classnames";

type ListFiltererOptions<T> = {
  listToFilter: T[];
  filterOptions: {
    [key: string]: (list: T[]) => T[];
  };
  defaultFilterOption: string;
  listComponent: (filterOption: string, filteredList: T[]) => ReactElement;
};

const ListFilterer = <T,>({
  listToFilter,
  filterOptions,
  defaultFilterOption,
  listComponent,
}: ListFiltererOptions<T>) => {
  if (!(defaultFilterOption in filterOptions)) {
    throw new TypeError("Default filter option is not in filterOptions!");
  }
  const [filterOption, setFilterOption] = useState(defaultFilterOption);

  const getFilterTab = (title: string) => {
    const [hover, setHover] = useState(false);
    const selected = filterOption === title;
    const underlineStyle = classNames({
      "h-1 w-full": true,
      "bg-primary rounded-full": selected,
      "bg-secondary rounded-full": !selected && hover,
    });
    return (
      <div
        key={title}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <button
          className="rounded-md focus:outline-none"
          disabled={selected}
          onClick={() => setFilterOption(title)}
        >
          <Text b className={selected ? "text-primary" : "text-secondary"}>
            {title}
          </Text>
        </button>
        <div className={underlineStyle} />
      </div>
    );
  };

  return (
    <>
      <div className="flex space-x-4">
        {Object.keys(filterOptions).map(getFilterTab)}
      </div>
      <div className="h-4" />
      <Card className="w-full h-5/6">
        {listComponent(filterOption, filterOptions[filterOption](listToFilter))}
      </Card>
    </>
  );
};

export default ListFilterer;
