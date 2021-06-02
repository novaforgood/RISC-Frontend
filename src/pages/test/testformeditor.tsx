import React, { useState } from "react";
import FormSchemaEditor from "../../components/FormSchemaEditor";
import { nanoid } from "nanoid";

const TestPage = ({}) => {
  const [form, setForm] = useState({
    sections: [
      {
        id: nanoid(),
        title: "Section 1",
        questions: [
          {
            id: nanoid(),
            title: "Question 1",
            type: "short-text",
          },
          {
            id: nanoid(),
            title: "Question 2",
            type: "paragraph",
          },
        ],
      },
    ],
  });
  return (
    <div>
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
