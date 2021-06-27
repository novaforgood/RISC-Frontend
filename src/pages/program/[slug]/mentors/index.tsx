import Fuse from "fuse.js";
import React, { Fragment, useState } from "react";
import { Button, Card, Input, Text } from "../../../../components/atomic";
import ProfileModal from "../../../../components/ProfileModal";
import {
  GetProfilesQuery,
  ProfileType,
  useGetProfilesQuery,
} from "../../../../generated/graphql";
import { useCurrentProgram } from "../../../../hooks";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import PageContainer from "../../../../layouts/PageContainer";
import Page from "../../../../types/Page";

type MentorProfile = GetProfilesQuery["getProfiles"][0];

interface MentorCardProps {
  // TODO: Remove "any" and replace with proper fields
  mentor: MentorProfile | any;
}
const MentorCard = ({ mentor }: MentorCardProps) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // const tags = mentor.tags?.slice(0, 3).map((tag: string, index: number) => (
  //   <div className="rounded-md bg-tertiary m-1 p-1" key={index}>
  //     {tag}
  //   </div>
  // ));
  // const moreTag = (
  //   <div className="rounded-md border-primary border m-1 p-1">
  //     + {mentor.tags?.length - 3} more
  //   </div>
  // );

  return (
    <Card className="flex flex-col p-6 place-items-center border-0">
      <div className="h-40 w-40 rounded-full bg-tertiary">
        <img src={mentor.user.profilePictureUrl}></img>
      </div>
      <div className="h-4"></div>

      <Text b className="text-body-1 text-center">
        {mentor.user.firstName} {mentor.user.lastName}
      </Text>
      {/* <div className="h-4"></div>
      <div className="flex flex-wrap justify-center">
        {tags}
        {mentor.tags?.length > 3 ? moreTag : <div></div>}
      </div> */}
      <div className="h-4"></div>
      <div className="h-24 w-full text-center break-words overflow-hidden overflow-ellipsis">
        {mentor.bio}
      </div>
      <div className="h-4"></div>

      <Button
        onClick={() => {
          setProfileModalOpen(true);
        }}
      >
        View Profile
      </Button>

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false);
        }}
        mentor={mentor}
      />
    </Card>
  );
};

const ViewMentorsPage: Page = () => {
  //const [getMentors, { mentorsData }] = useGetMentorssLazyQuery();
  //const [sortBy, setSortBy] = useState("");
  const [searchText, setSearchText] = useState("");

  const { currentProgram } = useCurrentProgram();
  const { data } = useGetProfilesQuery({
    variables: {
      programId: currentProgram?.programId!,
      profileType: ProfileType.Mentor,
    },
  });
  let unfiltered = data?.getProfiles || [];

  const fuse = new Fuse(unfiltered, {
    keys: ["user.firstName", "user.lastName", "profileJson"],
  });
  const mentors = searchText
    ? fuse.search(searchText).map((x) => x.item)
    : unfiltered;

  // const sortDropdown = () => {
  //   return (
  //     <div className="flex items-center">
  //       <Text b>Sort By</Text>
  //       <div className="w-2"></div>
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
      <div className="h-1"></div>
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
      ></Input>
      <div className="h-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mentors?.map((mentor: MentorProfile, index: number) => {
          return <MentorCard mentor={mentor} key={index} />;
        })}
      </div>
    </Fragment>
  );
};

ViewMentorsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>
    <PageContainer>{page}</PageContainer>
  </ChooseTabLayout>
);

export default ViewMentorsPage;
