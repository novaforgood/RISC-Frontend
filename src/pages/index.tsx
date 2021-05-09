import React, { useState } from "react";
import { LineInput } from "../components/atomic/LineInput";

const IndexPage = () => {

  return (
    <>
      <div>No placeholder</div>
      <LineInput />
      <br />
      <div>Placeholder</div>
      <LineInput placeholder="e.g. Nova Mentorship"/>
      <br />
      <div>Focus</div>
      <LineInput />
    </>
  );
};

export default IndexPage;
