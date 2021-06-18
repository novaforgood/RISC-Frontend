import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { Text } from "../../components/atomic";
import LocalStorage from "../../utils/localstorage";
import ProgramDropdown from "./ProgramDropdown";

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
        strokeWidth="1.5"
      />
      <line
        y1="-0.75"
        x2="8.37252"
        y2="-0.75"
        transform="matrix(0.716702 0.697379 -0.477583 0.878587 0 2)"
        stroke="#737373"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export interface BaseTabLayoutProps {
  basePath: string;
}

export function joinPath(...args: string[]): string {
  return args
    .map((part, i) => {
      if (!part) return "";
      if (i === 0) {
        return part.trim().replace(/[\/]*$/g, "");
      } else {
        return part.trim().replace(/(^[\/]*|[\/]*$)/g, "");
      }
    })
    .filter((x) => x.length)
    .join("/");
}

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
    <div className="flex h-screen w-screen">
      <div className="w-72 flex-shrink-0 bgWhite shadow-lg">
        <ProgramDropdown />
        <div className="overflow-y-auto">{children}</div>
      </div>
      <div className="flex-grow overflow-y-scroll overflow-x-hidden">
        {currentPageChildren}
      </div>
    </div>
  );
};

TabLayout.PageItem = ({ label, Icon, path }) => {
  const router = useRouter();
  const active = router.asPath === path;

  const pageItemStyles = classNames({
    "w-full pr-6 pl-8 py-1.5 flex items-center text-secondary cursor-pointer duration-150 select-none":
      true,
    "hover:bg-tertiary": !active,
    "textWhite bg-primary hover:bg-primary": active,
  });

  return (
    <Link href={path}>
      <div className={pageItemStyles}>
        <Icon
          color={active ? "white" : "#737373"}
          className="p-2 h-9 w-9 duration-150 flex-none"
        />
        <div className="w-1 flex-none" />
        <Text className="whitespace-nowrap overflow-ellipsis">{label}</Text>
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
