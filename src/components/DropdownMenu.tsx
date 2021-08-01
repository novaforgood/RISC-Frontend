import { Menu, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import { useAuth } from "../utils/firebase/auth";
import LocalStorage from "../utils/localstorage";

type DropdownProps = {
  button: ReactNode;
};

// Adapted from https://tailwindui.com/components/application-ui/elements/dropdowns

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const ItemStyle = (active: Boolean) =>
  classNames(
    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
    "hover:bg-tertiary block px-4 py-2 text-sm"
  );

export default function Dropdown({ button }: DropdownProps) {
  const { user, signOut } = useAuth();

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
                {/* {user && (
                  <Menu.Item>
                    {({ active }) => (
                      <Link href="/my/applications">
                        <a className={ItemStyle(active)}>My Applications</a>
                      </Link>
                    )}
                  </Menu.Item>
                )} */}
                {user && (
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/"
                        className={ItemStyle(active)}
                        onClick={() => {
                          LocalStorage.delete("cachedProfileSlug");
                        }}
                      >
                        My Homepage
                      </a>
                    )}
                  </Menu.Item>
                )}
                {user && (
                  <Menu.Item>
                    {({ active }) => (
                      <a href="/my/profile" className={ItemStyle(active)}>
                        My General Profile
                      </a>
                    )}
                  </Menu.Item>
                )}

                {user && (
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/"
                        className={ItemStyle(active)}
                        onClick={() => {
                          signOut();
                        }}
                      >
                        Log Out
                      </a>
                    )}
                  </Menu.Item>
                )}
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
