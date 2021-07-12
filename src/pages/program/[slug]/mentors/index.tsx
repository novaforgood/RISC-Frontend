import Fuse from "fuse.js";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Tag,
  Text,
} from "../../../../components/atomic";
import { Filter } from "../../../../components/icons";
import ProfileCard from "../../../../components/ProfileCard";
import {
  ProfileType,
  useGetProfilesQuery,
  useGetProfileTagsByProgramQuery,
} from "../../../../generated/graphql";
import { AuthorizationLevel, useCurrentProgram } from "../../../../hooks";
import AuthorizationWrapper from "../../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import PageContainer from "../../../../layouts/PageContainer";
import Page from "../../../../types/Page";

const ViewMentorsPage: Page = () => {
  //const [getMentors, { mentorsData }] = useGetMentorssLazyQuery();
  //const [sortBy, setSortBy] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filteredTags, setFilteredTags] = useState<{ [key: string]: string }>(
    {}
  );

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
  let unfiltered = data?.getProfiles || [];
  const [mentors, setMentors] = useState(unfiltered);

  useEffect(() => {
    if (unfiltered) {
      setMentors(unfiltered);
    }
  }, [unfiltered]);

  const fuse = new Fuse(mentors, {
    keys: ["user.firstName", "user.lastName", "profileJson"],
  });

  const filterByTags = () => {
    let checked = Object.keys(filteredTags);
    if (!checked.length) return unfiltered;
    let newMentors = unfiltered;
    newMentors = newMentors.filter(
      (profile) =>
        checked.filter(
          (profileTagId) =>
            profile.profileTags.findIndex(
              (el) => el.profileTagId === profileTagId
            ) > -1
        ).length
    );
    return newMentors;
  };

  useEffect(() => {
    setMentors(
      searchText ? fuse.search(searchText).map((x) => x.item) : filterByTags()
    );
  }, [searchText]);

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
  console.log(filteredTags);
  return (
    <Fragment>
      <Modal isOpen={filterModalOpen} onClose={() => false}>
        <div className="flex flex-col space-y-4">
          <Text h3 b>
            Filter Tags
          </Text>
          {profileTagsData &&
          profileTagsData.getProfileTagsByProgram.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {profileTagsData.getProfileTagsByProgram.map((tag) => {
                return (
                  <Checkbox
                    key={tag.profileTagId}
                    label={tag.name}
                    onCheck={(checked) => {
                      let newFilteredTags: { [key: string]: string } =
                        filteredTags;
                      if (checked) {
                        newFilteredTags![tag.profileTagId] = tag.name;
                      } else {
                        delete newFilteredTags![tag.profileTagId];
                      }

                      setFilteredTags(newFilteredTags);
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="py-6">
              <Text i className="text-secondary">
                This program hasn't set up their tags yet.
              </Text>
            </div>
          )}
          <Button
            className="self-center"
            size="small"
            onClick={() => {
              setMentors(filterByTags());
              setFilterModalOpen(false);
            }}
          >
            Finish
          </Button>
        </div>
      </Modal>
      <div className="flex justify-between">
        <Text b h2>
          All Mentors
        </Text>
        {/* {sortDropdown()} */}
      </div>
      <div className="flex items-center space-x-2">
        <Input
          className="w-full"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Filter
          className="hover:cursor-pointer"
          onClick={() => setFilterModalOpen(true)}
        />
      </div>
      <div className="h-4" />
      <div className="flex items-center">
        <Text>Current Filters:</Text>
        <div className="w-2" />
        {filteredTags && Object.keys(filteredTags).length > 0 ? (
          <div className="flex items-center space-x-2">
            {Object.values(filteredTags).map((tagName) => (
              <Tag variant="outline" key={tagName}>
                {tagName}
              </Tag>
            ))}
          </div>
        ) : (
          <Text i>None</Text>
        )}
      </div>
      <div className="h-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mentors?.map((mentor, index: number) => {
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
