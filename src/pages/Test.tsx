import React from "react";
import { EditorProvider } from "../components/RichTextEditing/EditorContext";
import TextEditor from "../components/RichTextEditing/RichTextEditor";

const Test = () => (
  <>
    <EditorProvider>
      <TextEditor />

      <h1>hello</h1>
    </EditorProvider>
  </>
);

export default Test;
