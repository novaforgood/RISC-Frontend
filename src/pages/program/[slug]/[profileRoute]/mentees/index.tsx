import React, { Fragment } from "react";
import { Input, Text } from "../../../../../components/atomic";
import ProfileCard from "../../../../../components/ProfileCard";
import {
  ProfileType,
  useGetProfilesQuery,
} from "../../../../../generated/graphql";
import { AuthorizationLevel, useCurrentProgram } from "../../../../../hooks";
import AuthorizationWrapper from "../../../../../layouts/AuthorizationWrapper";
import ChooseTabLayout from "../../../../../layouts/ChooseTabLayout";
import PageContainer from "../../../../../layouts/PageContainer";
import Page from "../../../../../types/Page";

const ViewMenteesPage: Page = () => {
  //const [getMentors, { mentorsData }] = useGetMentorssLazyQuery();
  //const [sortBy, setSortBy] = useState("");

  const { currentProgram } = useCurrentProgram();
  const { data } = useGetProfilesQuery({
    variables: {
      programId: currentProgram?.programId!,
      profileType: ProfileType.Mentee,
    },
  });
  const mentees = data?.getProfiles;

  const sortDropdown = () => {
    return (
      <div className="flex items-center">
        <Text b>Sort By</Text>
        <div className="w-2"></div>
        <select
          className="h-8 rounded-md"
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
    <Fragment>
      <div className="h-1"></div>
      <div className="flex justify-between">
        <Text b h2>
          All Mentees
        </Text>
        {sortDropdown()}
      </div>
      <Input className="w-full" placeholder="Search..."></Input>
      <div className="h-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mentees?.map((mentee, index: number) => {
          return <ProfileCard profile={mentee} key={index} />;
        })}
      </div>
    </Fragment>
  );
};

ViewMenteesPage.getLayout = (page, pageProps) => (
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

export default ViewMenteesPage;
