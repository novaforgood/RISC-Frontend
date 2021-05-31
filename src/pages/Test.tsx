import React from "react";
import { EditorProvider } from "../components/RichTextEditing/EditorContext";
import TextEditor from "../components/RichTextEditing/RichTextEditor";

const Test = () => (
  <>
    <h1>hello</h1>
    <EditorProvider>
      <TextEditor />
    </EditorProvider>
    <h1>hello</h1>
  </>
);

export default Test;
