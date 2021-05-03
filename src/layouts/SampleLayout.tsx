import React, { useEffect, useState } from "react";

interface SampleLayoutProps {}

const SampleLayout: React.FC<SampleLayoutProps> = ({ children }) => {
  return (
    <div>
      Sample layout!
      <div>{children}</div>
    </div>
  );
};

export default SampleLayout;
