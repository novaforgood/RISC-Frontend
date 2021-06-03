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
        helperText: "",
        type: "single-line",
      },
      {
        id: nanoid(),
        title: "Question 2",
        helperText: "",
        type: "paragraph",
      },
    ],
  });
  return (
    <div className="w-120 mx-auto">
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
    </div>
  );
};

export default TestPage;
