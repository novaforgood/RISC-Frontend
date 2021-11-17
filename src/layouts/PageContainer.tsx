import { HTMLAttributes } from "react";

const PageContainer = ({ children }: HTMLAttributes<HTMLDivElement>) => {
  // TODO: Add responsiveness
  return (
    <div className="min-h-full md:h-screen bg-tertiary flex flex-col items-center py-10 overflow-y-auto">
      <div className="w-11/12 md:w-5/6">{children}</div>
    </div>
  );
};

export default PageContainer;
