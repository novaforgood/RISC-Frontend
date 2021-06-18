import { HTMLAttributes } from "react";

const PageContainer = ({ children }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="h-screen bg-tertiary flex flex-col items-center py-10">
      <div className="w-300">{children}</div>
    </div>
  );
};

export default PageContainer;
