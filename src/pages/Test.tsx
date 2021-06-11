import React from "react";
import { EditorProvider } from "../components/RichTextEditing/EditorContext";
import { Button, Text, Card } from "../components/atomic";
import ToolBar from "../components/RichTextEditing/ToolBar";
import TextEditor from "../components/RichTextEditing/RichTextEditor";

//TODO: Figure out how we want the scrolling behavior to work
//TODO: Answer "Should the homepage be by default a really long card / What contents should it have"
//TODO: Determine when the button should be disabled
//TODO: saving contents of the homepage
const Test = () => (
  <div className="box-border bg-tertiary min-h-screen py-24 px-28 flex">
    {/*Stand-in for the mentorship logo*/}
    <Card className="box-border w-full px-16 py-10">
      <img
        className="w-24 h-24 absolute transform -translate-y-24"
        src="/static/HappyBlobs.svg"
      />
      <div className="h-2" />
      <Text className="h-3" h1 b>
        Name of Mentorship Homepage
      </Text>
      <div className="h-2" />
      <EditorProvider>
        <div className="box-border w-full sticky top-4 z-10 rounded-md flex justify-end">
          <div className="flex-grow self-center ">
            <ToolBar />
          </div>
          <Button
            onClick={() => {
              /* Save contents of homepage */
            }}
          >
            Publish
          </Button>
        </div>
        <div className="h-2" />
        <TextEditor />
      </EditorProvider>
    </Card>
  </div>
);

export default Test;
