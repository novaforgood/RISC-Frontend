import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import Link from "next/link";
import { Fragment } from "react";
import { Text } from "../../components/atomic";
import { useGetMyUserQuery } from "../../generated/graphql";
import { useCurrentProgram } from "../../hooks";

const ProgramDropdown = () => {
  const { currentProgram } = useCurrentProgram();
  const { data } = useGetMyUserQuery();
  return (
    <div>
      <Menu as="div" className="relative text-left">
        <Menu.Button className="w-full outline-none focus:outline-none">
          <div className="flex p-2 items-center ">
            <img
              className="h-10 w-10 object-contain border border-inactive rounded"
              src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/13/Enchanted_Diamond_Pickaxe.gif"
            />
            <div className="w-3 flex-shrink-0"></div>
            <Text className="whitespace-nowrap truncate">
              {currentProgram?.name}
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
            className="absolute -right-12 w-64 mt-1 origin-top-right bg-white rounded-md 
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
                        src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/13/Enchanted_Diamond_Pickaxe.gif"
                      />
                      <div className="w-3 flex-shrink-0"></div>
                      <Text className="truncate">{program.name}</Text>
                    </div>
                  </Link>
                </Menu.Item>
              );
            })}
            <Menu.Item>
              <Link href="/join">
                <div className="p-2 w-full cursor-pointer hover:bg-tertiary">
                  Join a mentorship
                </div>
              </Link>
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
