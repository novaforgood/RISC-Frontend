import { nanoid } from "nanoid";
import React, { useState } from "react";
import { Text } from "../../components/atomic";
import FormSchemaEditor, { Form } from "../../components/FormSchemaEditor";

const TestPage = ({}) => {
  const [form, setForm] = useState<Form>({
    questions: [
      {
        id: nanoid(),
        title: "Question 1",
        description: "",
        type: "single-line",
      },
      {
        id: nanoid(),
        title: "Question 2",
        description: "",
        type: "paragraph",
      },
    ],
  });
  return (
    <div className="w-screen h-screen flex items-start justify-center">
      <div className="w-120">
        <div className="h-4"></div>
        <Text h2>Form Editor</Text>
        <div className="h-4"></div>

        <FormSchemaEditor
          form={form}
          onChange={(newForm) => {
            console.log(newForm);
            setForm(newForm);
          }}
        />
      </div>{" "}
    </div>
  );
};

export default TestPage;
