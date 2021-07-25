import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Text } from "../../components/atomic";
import { ProfileType, useGetMyUserQuery } from "../../generated/graphql";
import { useCurrentProgram } from "../../hooks";
import LocalStorage from "../../utils/localstorage";

const MAP_PROFILETYPE_TO_NAME = {
  [ProfileType.Admin]: "Admin",
  [ProfileType.Mentor]: "Mentor",
  [ProfileType.Mentee]: "Mentee",
};

const ProgramDropdown = () => {
  const { currentProgram } = useCurrentProgram();
  const { data } = useGetMyUserQuery();
  const router = useRouter();

  return router.pathname === "/" ? (
    <div className="flex p-2 items-center ">
      <img
        className="h-10 w-10 object-contain border border-inactive rounded"
        src={currentProgram?.iconUrl || "/static/DefaultLogo.svg"}
      />
      <div className="w-3 flex-shrink-0" />
      <Text className="whitespace-nowrap truncate" b>
        Mentor Center
      </Text>
    </div>
  ) : (
    <div>
      <Menu as="div" className="relative text-left">
        <Menu.Button className="w-full outline-none focus:outline-none">
          <div className="flex p-2 items-center ">
            <img
              className="h-10 w-10 object-contain rounded"
              src={currentProgram?.iconUrl || "/static/DarkDefaultLogo.svg"}
            />
            <div className="w-3 flex-shrink-0" />
            <Text className="whitespace-nowrap truncate" b>
              {currentProgram?.name || "Mentor Center"}
            </Text>
          </div>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute -right-12 w-72 mt-1 origin-top-right bg-white rounded-md 
            shadow-lg ring-1 ring-primary ring-opacity-5 focus:outline-none"
          >
            {data?.getMyUser?.profiles.map((profile, i) => {
              const { program } = profile;
              const active = program.programId === currentProgram?.programId;
              const styles = classNames({
                "p-2 w-full cursor-pointer flex items-center": true,
                "bg-white hover:bg-tertiary": !active,
                "bg-inactive hover:bg-inactive pointer-events-none": active,
              });
              return (
                <Menu.Item key={i}>
                  <Link href={`/program/${program.slug}`}>
                    <div className={styles}>
                      <img
                        className="h-8 w-8 object-contain border border-inactive rounded"
                        src={program.iconUrl || "/static/DefaultLogo.svg"}
                      />
                      <div className="w-3 flex-shrink-0"></div>
                      <div className="flex flex-col">
                        <Text className="truncate">{program.name}</Text>
                        <Text className="text-secondary text-caption leading-4">
                          {MAP_PROFILETYPE_TO_NAME[profile.profileType]}
                        </Text>
                      </div>
                    </div>
                  </Link>
                </Menu.Item>
              );
            })}
            {/* <Menu.Item>
              <Link href="/join">
                <div className="p-2 w-full cursor-pointer hover:bg-tertiary">
                  Join a mentorship
                </div>
              </Link>
            </Menu.Item> */}
            <Menu.Item>
              <a
                href="/"
                className="w-full"
                onClick={() => {
                  LocalStorage.delete("cachedProgramSlug");
                }}
              >
                <div className="p-2 w-full cursor-pointer hover:bg-tertiary">
                  <Text>Go to my homepage</Text>
                </div>
              </a>
            </Menu.Item>
            <Menu.Item>
              <Link href="/create">
                <div className="p-2 w-full cursor-pointer hover:bg-tertiary">
                  Create a mentorship
                </div>
              </Link>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default ProgramDropdown;
