import React from "react";
import { Button, Card, Tag, Text } from "../../components/atomic";
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
      <Card className="h-60 w-60">
        <Text>Blaah</Text>
        <div className="h-1"></div>
        <Tag>Sample Tag</Tag>
        <Tag variant="outline">Outline Tag</Tag>
      </Card>
    </>
  );
};

export default IndexPage;
