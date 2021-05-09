import React from "react";
import { Input } from "../components/atomic/Input";

const IndexPage = () => {

  return (
    <>
      <div>No placeholder</div>
      <Input />
      <br />
      <div>Placeholder</div>
      <Input placeholder="e.g. Nova Mentorship"/>
      <br />
      <div>Focus</div>
      <Input />
    </>
  );
};

export default IndexPage;
