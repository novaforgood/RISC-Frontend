import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, ReactNode } from "react";
import { AuthorizationLevel, useAuthorizationLevel } from "../hooks";
import { useAuth } from "../utils/firebase/auth";

type DropdownProps = {
  button: ReactNode;
};

// Adapted from https://tailwindui.com/components/application-ui/elements/dropdowns

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdown({ button }: DropdownProps) {
  const { user, signOut } = useAuth();
  const authorizationLevel = useAuthorizationLevel();

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-bottom-left  mb-4 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1">
                {/* <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      General Profile
                    </a>
                  )}
                </Menu.Item> */}
                {authorizationLevel != AuthorizationLevel.Admin && (
                  <Menu.Item>
                    {({ active }) => (
                      <Link href="/my/applications">
                        <a
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          My Applications
                        </a>
                      </Link>
                    )}
                  </Menu.Item>
                )}
                {user ? (
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                        onClick={() => {
                          signOut();
                        }}
                      >
                        Log Out
                      </a>
                    )}
                  </Menu.Item>
                ) : null}
              </div>
            </Menu.Items>
          </Transition>

          <div>
            <Menu.Button className="focus:outline-none">{button}</Menu.Button>
          </div>
        </>
      )}
    </Menu>
  );
}
