import { nanoid } from "nanoid";
import React, { useState } from "react";
import FormSchemaEditor, { Form } from "../../components/FormSchemaEditor";

const TestPage = ({}) => {
  const [form, setForm] = useState<Form>({
    questions: [
      {
        id: nanoid(),
        title: "Question 1",
        type: "single-line",
      },
      {
        id: nanoid(),
        title: "Question 2",
        type: "paragraph",
      },
    ],
  });
  return (
    <div className="w-1/2">
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
