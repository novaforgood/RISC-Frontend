import { HTMLAttributes } from "react";

const PageContainer = ({ children }: HTMLAttributes<HTMLDivElement>) => {
  // TODO: Add responsiveness
  return (
    <div className="h-screen bg-tertiary flex flex-col items-center py-10 overflow-y-scroll">
      <div className="w-100 xl:w-200 2xl:w-300">{children}</div>
    </div>
  );
};

export default PageContainer;
