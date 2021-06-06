import React from "react";
import { Button, Tag, Text } from "../../components/atomic";
import { useGetUsersLazyQuery } from "../../generated/graphql";

const IndexPage = () => {
  const [getUser, { data }] = useGetUsersLazyQuery();

  return (
    <>
      <Button
        size="medium"
        variant="solid"
        onClick={() => {
          getUser();
          console.log("hi");
          console.log(data);
        }}
      >
        Get users
      </Button>
      <p>{JSON.stringify(data)}</p>
      <Text>Blaah</Text>
      <Tag>Sample Tag</Tag>
    </>
  );
};

export default IndexPage;
