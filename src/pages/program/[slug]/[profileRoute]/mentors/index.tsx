import { Transition } from "@headlessui/react";
import Fuse from "fuse.js";
import React, { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Input, Text } from "../../../../../components/atomic";
import { Filter, Search } from "../../../../../components/icons";
import ProfileCard from "../../../../../components/ProfileCard";
import TagSelector from "../../../../../components/tags/TagSelector";
import {
  ProfileType,
  useGetProfilesQuery,
  useGetProfileTagsByProgramQuery,
} from "../../../../../generated/graphql";
import { AuthorizationLevel, useCurrentProgram } from "../../../../../hooks";
import AuthorizationWrapper from "../../../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../../../layouts/ChooseTabLayout";
import PageContainer from "../../../../../layouts/PageContainer";
import Page from "../../../../../types/Page";

const appRoot = document.getElementById("__next")!;

interface DrawerProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onRequestClose: () => void;
}
const Drawer = ({
  isOpen = false,
  title,
  children,
  onRequestClose,
}: DrawerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current!.contains(event.target as Node)) {
      onRequestClose();
    }
  };
  useEffect(() => {
    window.addEventListener("click", handleClickOutside, false);
    return () => {
      window.removeEventListener("click", handleClickOutside, false);
    };
  }, []);
  return createPortal(
    <Transition
      show={isOpen}
      className="fixed h-screen right-0 top-0 w-96 bg-white p-6 shadow-md"
      enter="ease-out duration-200"
      enterFrom="-right-96"
      enterTo="right-0"
      entered="right-0"
      leave="ease-in duration-200"
      leaveFrom="right-0"
      leaveTo="-right-96"
    >
      <div ref={ref}>
        <div className="flex justify-between">
          <Text h3 b>
            {title}
          </Text>
          <Button size="auto" className="px-2" onClick={onRequestClose}>
            close
          </Button>
        </div>

        <div className="h-6"></div>
        <div className="w-full h-full">{children}</div>
      </div>
    </Transition>,
    appRoot
  );
};

const ViewMentorsPage: Page = () => {
  //const [getMentors, { mentorsData }] = useGetMentorssLazyQuery();
  //const [sortBy, setSortBy] = useState("");
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  const { currentProgram } = useCurrentProgram();
  const { data } = useGetProfilesQuery({
    variables: {
      programId: currentProgram?.programId!,
      profileType: ProfileType.Mentor,
    },
  });
  const { data: profileTagsData } = useGetProfileTagsByProgramQuery({
    variables: { programId: currentProgram?.programId! },
  });
  let unfilteredProfiles = data?.getProfiles || [];

  const fuse = new Fuse(unfilteredProfiles, {
    keys: ["user.firstName", "user.lastName", "profileJson", "bio"],
  });

  const filterMentors = () => {
    let newMentors = searchText
      ? fuse.search(searchText).map((x) => x.item)
      : unfilteredProfiles;
    if (!filteredTags.length) {
      return newMentors;
    }

    newMentors = newMentors.filter((profile) => {
      const profileTagIds = new Set(
        profile.profileTags.map((tag) => tag.profileTagId)
      );
      for (const tag of filteredTags) {
        if (!profileTagIds.has(tag)) return false;
      }
      return true;
    });

    return newMentors;
  };

  const filteredMentors = filterMentors();

  // const sortDropdown = () => {
  //   return (
  //     <div className="flex items-center">
  //       <Text b>Sort By</Text>
  //       <div className="w-2" />
  //       <select
  //         className="h-8 rounded-md"
  //         name="sort"
  //         /*onChange={setSortBy(e.target.value)}*/
  //       >
  //         <option value="latest">Date Joined (latest)</option>
  //         <option value="earliest">Date Joined (earliest)</option>
  //         <option value="atoz">Name (A-Z)</option>
  //         <option value="ztoa">Name (Z-A)</option>
  //       </select>
  //     </div>
  //   );
  // };
  return (
    <Fragment>
      <Drawer
        title="Filter Mentors"
        isOpen={drawerOpen}
        onRequestClose={() => {
          setDrawerOpen(false);
        }}
      >
        <TagSelector
          selectableTagCategories={currentProgram?.profileTagCategories || []}
          selectableTags={profileTagsData?.getProfileTagsByProgram || []}
          selectedTagIds={filteredTags}
          onChange={(newSelectedTagIds: string[]) => {
            setFilteredTags(newSelectedTagIds);
          }}
        />
      </Drawer>
      <div className="flex justify-between">
        <Text b h2>
          All Mentors
        </Text>
        {/* {sortDropdown()} */}
      </div>
      <div className="h-4" />
      <Text>
        Mentors fill out their profiles and set their availability so that
        mentees can book chats with them. They are <Text b>super excited</Text>{" "}
        to talk!
      </Text>
      <div className="h-4" />
      <div className="flex items-center gap-4">
        <Button
          size="small"
          className="flex gap-2 cursor-pointer items-center justify-center flex-shrink-0"
          onClick={() => {
            if (!drawerOpen) setDrawerOpen(true);
          }}
        >
          Filter <Filter className="h-4 w-4" />
        </Button>
        <div className="relative">
          <Input
            autoFocus
            placeholder="Search"
            className="w-full relative pl-8"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <div className="absolute left-3 h-full top-0 flex items-center my-auto">
            <Search className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="h-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMentors.map((mentor, index: number) => {
          return <ProfileCard profile={mentor} key={index} />;
        })}
      </div>
    </Fragment>
  );
};

ViewMentorsPage.getLayout = (page, pageProps) => (
  <AuthorizationWrapper
    canView={[
      AuthorizationLevel.Admin,
      AuthorizationLevel.Mentor,
      AuthorizationLevel.Mentee,
    ]}
  >
    <ChooseTabLayout {...pageProps}>
      <PageContainer>{page}</PageContainer>
    </ChooseTabLayout>
  </AuthorizationWrapper>
);

export default ViewMentorsPage;
