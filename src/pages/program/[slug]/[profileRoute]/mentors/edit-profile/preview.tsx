import React from "react";
import { Text } from "../../../../../../components/atomic";
import { useCurrentProgram } from "../../../../../../hooks";
import Page from "../../../../../../types/Page";

// import { Question } from "../../../../../../types/Form";
// function getQuestionsFromJson(json: string): Question[] {
//   try {
//     return JSON.parse(json) as Question[];
//   } catch (e) {
//     return [];
//   }
// }

const ProgramPage: Page = (_) => {
  const { currentProgram } = useCurrentProgram();

  return (
    <div>
      <Text h1>Mentor Profile Schema Preview</Text>
      <div>Todo: read-only form</div>
      <div>{JSON.stringify(currentProgram)}</div>
    </div>
  );
};

export default ProgramPage;
