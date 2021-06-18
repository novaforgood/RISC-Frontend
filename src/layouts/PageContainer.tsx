import { HTMLAttributes } from "react";

const PageContainer = ({ children }: HTMLAttributes<HTMLDivElement>) => {
  // TODO: Add responsiveness
  return (
    <div className="min-h-screen bg-tertiary flex flex-col items-center py-10">
      <div className="w-300">{children}</div>
    </div>
  );
};

export default PageContainer;
