import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { Text } from "../../components/atomic";
import LocalStorage from "../../utils/localstorage";

interface ArrowProps {
  down: boolean;
}
const Arrow: React.FC<ArrowProps> = ({ down }) => {
  const arrowStyles = classNames({
    "transform duration-100 h-3.5 w-3.5": true,
    "-rotate-90": down,
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
  Dropdown: React.FC<{ label: string; id: string }>;
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
    "w-full pr-6 pl-8 py-1.5 flex items-center text-secondary cursor-pointer duration-100 select-none":
      true,
    "hover:bg-tertiary": !active,
    "text-white bg-primary hover:bg-primary": active,
  });

  return (
    <Link href={path}>
      <div className={pageItemStyles}>
        <Icon
          color={active ? "white" : "#737373"}
          className="p-2 h-9 w-9 duration-100 flex-none"
        />
        <div className="w-1 flex-none" />
        <Text className="whitespace-nowrap">{label}</Text>
      </div>
    </Link>
  );
};

TabLayout.Dropdown = ({ children, label, id }) => {
  const [open, setOpen] = useState(false);

  const dropdownStyles = classNames({
    "flex cursor-pointer text-secondary py-3 px-3 hover:bg-tertiary duration-100 \
    items-center select-none":
      true,
    "hover:bg-tertiary": open,
  });

  useEffect(() => {
    const initState = LocalStorage.get(`tablayout-${id}`);
    if (initState !== null) {
      setOpen(initState);
    } else {
      setOpen(true);
    }
    return () => {};
  }, []);

  return (
    <div>
      <div
        onClick={() => {
          setOpen((prev) => {
            LocalStorage.set(`tablayout-${id}`, !prev);
            return !prev;
          });
        }}
        className={dropdownStyles}
      >
        <div className="pb-0.5">
          <Arrow down={!open} />
        </div>
        <div className="w-4 flex-none" />
        <Text b className="whitespace-nowrap">
          {label}
        </Text>
      </div>

      {open && children}
    </div>
  );
};

TabLayout.Separator = () => {
  return <div className="h-0.25 w-full bg-tertiary"></div>;
};

export default TabLayout;
