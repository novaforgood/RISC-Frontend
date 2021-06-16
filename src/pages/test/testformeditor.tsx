import { nanoid } from "nanoid";
import React, { useState } from "react";
import { Text } from "../../components/atomic";
import FormSchemaEditor from "../../components/FormSchemaEditor";
import { Question } from "../../types/Form";

const TestPage = ({}) => {
  const [formQuestions, setFormQuestions] = useState<Question[]>([
    {
      id: nanoid(),
      title: "Question 1",
      description: "",
      type: "short-answer",
    },
    {
      id: nanoid(),
      title: "Question 2",
      description: "",
      type: "long-answer",
    },
  ]);
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start">
      <div className="h-4"></div>
      <Text h2>Form Editor</Text>
      <div className="h-4"></div>

      <FormSchemaEditor
        questions={formQuestions}
        onChange={(newQuestions) => {
          setFormQuestions(newQuestions);
        }}
      />
    </div>
  );
};

export default TestPage;
