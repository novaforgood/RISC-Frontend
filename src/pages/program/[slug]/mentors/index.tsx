import React from "react";
import { Card, Input, Text } from "../../../../components/atomic";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import Page from "../../../../types/Page";

const renderMentorCard = (mentor: any, idx: number) => {
  const tags = mentor.tags
    .slice(0, 3)
    .map((tag: string) => (
      <div className="rounded-md bg-tertiary m-1 p-1">{tag}</div>
    ));
  const moreTag = (
    <div className="rounded-md border-primary border m-1 p-1">
      + {mentor.tags.length - 3} more
    </div>
  );
  return (
    <Card
      className="flex flex-col m-5 p-6 place-items-center border-0"
      key={idx}
    >
      <div className="h-40 w-40 rounded-full bg-tertiary">
        <img src={mentor.profileImg}></img>
      </div>
      <Text b className="text-body-1 text-center">
        {mentor.displayName}
      </Text>
      <div className="flex flex-wrap justify-center">
        {tags}
        {mentor.tags.length > 3 ? moreTag : <div></div>}
      </div>
      <Text>{mentor.description}</Text>
    </Card>
  );
};

const renderMentors = (mentors: Array<any>) => {
  const cards = mentors.map((mentor: any, idx) =>
    renderMentorCard(mentor, idx)
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {cards}
    </div>
  );
};

const ViewMentorsPage: Page = () => {
  //const [getMentors, { mentorsData }] = useGetMentorssLazyQuery();
  //const [sortBy, setSortBy] = useState("");

  const mentor = {
    profileImg: "",
    displayName: "Bob Jenkins",
    tags: ["2022", "Cognitive Science", "Goated", "yurt", "LOL"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniammod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim",
  };
  const mentors = [mentor, mentor, mentor];

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
      {renderMentors(mentors)}
    </div>
  );
};

ViewMentorsPage.getLayout = (page, pageProps) => (
  <ChooseTabLayout {...pageProps}>{page}</ChooseTabLayout>
);

export default ViewMentorsPage;
