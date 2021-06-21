import React from "react";
import { Button, Card, Tag, Text } from "../../components/atomic";
import {
  useGetUsersLazyQuery,
  useGetProfileTagsByProgramLazyQuery,
  useCreateProfileTagMutation,
  CreateProfileTagInput,
} from "../../generated/graphql";

const IndexPage = () => {
  const [getUser, { data }] = useGetUsersLazyQuery();
  const [getTags, { tags }] = useGetProfileTagsByProgramLazyQuery();
  const [createTag] = useCreateProfileTagMutation();

  let createTagInput: CreateProfileTagInput = {
    name: "blah",
    programId: "xfMHQGFjgb0VEKQZtuyKv",
  };

  return (
    <>
      <Button
        size="medium"
        variant="solid"
        onClick={() => {
          getUser();
          createTag({
            variables: { data: createTagInput },
          });
          getTags({ variables: { programId: "xfMHQGFjgb0VEKQZtuyKv" } });
        }}
      >
        Get users
      </Button>
      <p>{JSON.stringify(data)}</p>
      <p>{JSON.stringify(tags)}</p>
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
