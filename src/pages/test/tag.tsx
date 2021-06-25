import React from "react";
import { Button, Card, Tag, Text } from "../../components/atomic";
import {
  useGetProfileTagsByProgramLazyQuery,
  useCreateProfileTagMutation,
  useUpdateProfileTagMutation,
  CreateProfileTagInput,
  UpdateProfileTagInput,
} from "../../generated/graphql";

const IndexPage = () => {
  const [getTags, { data }] = useGetProfileTagsByProgramLazyQuery();
  const [createTag] = useCreateProfileTagMutation();
  const [updateTag] = useUpdateProfileTagMutation();

  let createTagInput: CreateProfileTagInput = {
    name: "blah",
    programId: "c95bd919-093c-46b8-a42e-0f492e961b42",
  };
  let updateTagInput: UpdateProfileTagInput = {
    profileTagId: data?.getProfileTagsByProgram[0].profileTagId,
    name: "updated-blah",
  };

  return (
    <>
      <Button
        size="medium"
        variant="solid"
        onClick={() => {
          createTag({
            variables: { data: createTagInput },
          });
          getTags({
            variables: { programId: "c95bd919-093c-46b8-a42e-0f492e961b42" },
          });
        }}
      >
        Get users
      </Button>
      <Button
        onClick={() => {
          console.log(updateTagInput);
          updateTag({
            variables: {
              profileTagId: updateTagInput.profileTagId,
              data: updateTagInput,
            },
          })
            .then(console.log("yay"))
            .catch(console.log("nay"));
        }}
      >
        update
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
