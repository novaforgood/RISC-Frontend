import React, { useState, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Text } from "../../components/atomic";
import classNames from "classnames";

interface ArrowProps {
  up: boolean;
}
const Arrow: React.FC<ArrowProps> = ({ up }) => {
  console.log(up);
  const arrowStyles = classNames({
    "transform duration-200 h-3.5 w-3.5": true,
    "-rotate-180": up,
  });
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={arrowStyles}
    >
      <line
        y1="-0.75"
        x2="8.37252"
        y2="-0.75"
        transform="matrix(-0.716702 0.697379 0.477583 0.878587 12 2)"
        stroke="#737373"
        stroke-width="1.5"
      />
      <line
        y1="-0.75"
        x2="8.37252"
        y2="-0.75"
        transform="matrix(0.716702 0.697379 -0.477583 0.878587 0 2)"
        stroke="#737373"
        stroke-width="1.5"
      />
    </svg>
  );
};

interface TabLayoutProps {
  currentPageChildren: ReactNode;
}

const TabLayout: React.FC<TabLayoutProps> & {
  Separator: React.FC;
  Dropdown: React.FC<{ label: string }>;
  PageItem: React.FC<{
    path: string;
    label: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }>;
} = ({ children, currentPageChildren }) => {
  return (
    <div className="flex h-screen">
      <div className="w-1/6 bg-white shadow-lg overflow-x-hidden overflow-y-scroll">
        <div className="whitespace-nowrap">Mentorship Name Placeholder</div>
        {children}
      </div>
      <div className="w-5/6">{currentPageChildren}</div>
    </div>
  );
};

TabLayout.PageItem = ({ label, Icon, path }) => {
  const router = useRouter();
  const active = router.pathname === path;

  const pageItemStyles = classNames({
    "w-full px-4 flex items-center text-secondary cursor-pointer hover:bg-tertiary duration-200 select-none":
      true,
    "text-white bg-black hover:bg-black": active,
  });

  return (
    <Link href={path}>
      <div className={pageItemStyles}>
        <Icon
          color={active ? "white" : "#737373"}
          className="p-2 h-10 w-10 duration-200 flex-none"
        />
        <div className="w-2 flex-none" />
        <Text b className="whitespace-nowrap">
          {label}
        </Text>
      </div>
    </Link>
  );
};

TabLayout.Dropdown = ({ children, label }) => {
  const [open, setOpen] = useState(false);

  const dropdownStyles = classNames({
    "flex cursor-pointer text-secondary py-4 px-4 hover:bg-tertiary duration-200 \
     justify-between items-center select-none":
      true,
    "hover:bg-tertiary": open,
  });

  return (
    <div>
      <div
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className={dropdownStyles}
      >
        <Text b className="whitespace-nowrap">
          {label}
        </Text>
        <div className="w-2 flex-none" />
        <div className="pb-0.5">
          <Arrow up={open} />
        </div>
      </div>

      {open && children}
    </div>
  );
};

TabLayout.Separator = () => {
  return <div className="h-0.25 w-full bg-tertiary"></div>;
};

export default TabLayout;
