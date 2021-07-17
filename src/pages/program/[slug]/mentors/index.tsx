import Fuse from "fuse.js";
import React, { Fragment, useEffect, useState } from "react";
import { Input, Text } from "../../../../components/atomic";
import ProfileCard from "../../../../components/ProfileCard";
import TagSelector from "../../../../components/tags/TagSelector";
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
  let unfiltered = data?.getProfiles || [];
  const [mentors, setMentors] = useState(unfiltered);

  useEffect(() => {
    if (unfiltered) {
      setMentors(unfiltered);
    }
  }, [unfiltered]);

  const fuse = new Fuse(unfiltered, {
    keys: ["user.firstName", "user.lastName", "profileJson"],
  });

  const filterMentors = (tags: string[]) => {
    let newMentors = searchText
      ? fuse.search(searchText).map((x) => x.item)
      : unfiltered;
    if (!tags.length) {
      setMentors(newMentors);
      return;
    }
    newMentors = newMentors.filter((profile) => {
      const profileTagIds = profile.profileTags.map(
        (profileTag) => profileTag.profileTagId
      );
      for (const tag of tags) {
        if (!profileTagIds.includes(tag)) {
          return false;
        }
      }
      return true;
    });
    setMentors(newMentors);
  };

  useEffect(() => {
    filterMentors(filteredTags);
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
  return (
    <Fragment>
      <div className="flex justify-between">
        <Text b h2>
          All Mentors
        </Text>
        {/* {sortDropdown()} */}
      </div>
      <Input
        className="w-full"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <div className="h-4" />
      <div className="flex">
        <Text className="w-full">Tag Filters:</Text>
        <div className="w-2" />
        <TagSelector
          selectableTags={profileTagsData?.getProfileTagsByProgram || []}
          selectedTagIds={filteredTags}
          onChange={(newSelectedTagIds: string[]) => {
            setFilteredTags(newSelectedTagIds);
            filterMentors(newSelectedTagIds);
          }}
        />
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
