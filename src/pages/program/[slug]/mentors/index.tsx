import React, { useState } from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  Text,
} from "../../../../components/atomic";
import {
  GetProfilesQuery,
  ProfileType,
  useGetProfilesQuery,
} from "../../../../generated/graphql";
import { useCurrentProgram } from "../../../../hooks";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import Page from "../../../../types/Page";

type MentorProfile = GetProfilesQuery["getProfiles"][0];

interface MentorCardProps {
  // TODO: Remove "any" and replace with proper fields
  mentor: MentorProfile | any;
}
const MentorCard = ({ mentor }: MentorCardProps) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const tags = mentor.tags?.slice(0, 3).map((tag: string, index: number) => (
    <div className="rounded-md bg-tertiary m-1 p-1" key={index}>
      {tag}
    </div>
  ));
  const moreTag = (
    <div className="rounded-md border-primary border m-1 p-1">
      + {mentor.tags?.length - 3} more
    </div>
  );

  return (
    <Card className="flex flex-col m-5 p-6 place-items-center border-0">
      <div className="h-40 w-40 rounded-full bg-tertiary">
        <img src={mentor.user.profilePictureUrl}></img>
      </div>
      <div className="h-4"></div>

      <Text b className="text-body-1 text-center">
        {mentor.user.firstName} {mentor.user.lastName}
      </Text>
      <div className="h-4"></div>

      <div className="flex flex-wrap justify-center">
        {tags}
        {mentor.tags?.length > 3 ? moreTag : <div></div>}
      </div>
      <div className="h-4"></div>

      <Text>{mentor.user.firstName}</Text>
      <div className="h-4"></div>

      <Button
        onClick={() => {
          setProfileModalOpen(true);
        }}
      >
        Book a Chat
      </Button>

      <Modal
        isOpen={profileModalOpen}
        onClose={() => {
          setProfileModalOpen(false);
        }}
      >
        <div className="flex p-4">
          <div className="flex flex-col items-center">
            <div className="h-40 w-40 rounded-full bg-tertiary">
              <img src={mentor.user.profilePictureUrl}></img>
            </div>
            <div className="h-4"></div>
            <Text b1 b>
              {mentor.user.firstName} {mentor.user.lastName}
            </Text>
          </div>
          <div className="w-8"></div>
          <div>
            <div>
              <div className="rounded bg-tertiary p-4">
                <table className="table-auto">
                  <tr>
                    <td>
                      <Text b>Email:</Text>
                    </td>
                    <td className="pl-4">
                      <Text>{mentor.user.email}</Text>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div className="h-2"></div>

            <div className="flex">
              <Button size="small">Book a Chat</Button>
              <div className="w-2"></div>
              <Button size="small" variant="inverted">
                Request Mentor
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

const ViewMentorsPage: Page = () => {
  //const [getMentors, { mentorsData }] = useGetMentorssLazyQuery();
  //const [sortBy, setSortBy] = useState("");

  const { currentProgram } = useCurrentProgram();
  const { data } = useGetProfilesQuery({
    variables: {
      programId: currentProgram?.programId!,
      profileType: ProfileType.Mentor,
    },
  });
  const mentors = data?.getProfiles;

  const sortDropdown = () => {
    return (
      <div className="flex">
        <Text b>Sort By</Text>
        <div className="w-2"></div>
        <select
          className="h-5"
          name="sort"
          /*onChange={setSortBy(e.target.value)}*/
        >
          <option value="latest">Date Joined (latest)</option>
          <option value="earliest">Date Joined (earliest)</option>
          <option value="atoz">Name (A-Z)</option>
          <option value="ztoa">Name (Z-A)</option>
        </select>
      </div>
    );
  };

  return (
    <div className="bg-tertiary w-full min-h-screen p-5 justify-center items-center">
      <div className="h-1"></div>
      <div className="flex justify-between">
        <Text b h2>
          All Mentors
        </Text>
        {sortDropdown()}
      </div>
      <Input className="h-5 w-full" placeholder="Search..."></Input>
      <div className="h-1"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {mentors?.map((mentor: MentorProfile, index: number) => {
          return <MentorCard mentor={mentor} key={index} />;
        })}
      </div>
    </div>
  );
};

ViewMentorsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default ViewMentorsPage;
