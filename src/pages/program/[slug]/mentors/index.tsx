import { addMinutes, getDay, isBefore } from "date-fns";
import dateFormat from "dateformat";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  Text,
} from "../../../../components/atomic";
import Calendar from "../../../../components/Calendar";
import {
  DateInterval,
  GetProfilesQuery,
  ProfileType,
  useGetProfilesQuery,
  useGetWeeklyAvailabilitiesQuery,
} from "../../../../generated/graphql";
import { useCurrentProgram } from "../../../../hooks";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import Page from "../../../../types/Page";

type MentorProfile = GetProfilesQuery["getProfiles"][0];

function generateTimeslots(
  day: Date | null,
  minutesPerTimeslot: number,
  weeklyAvailabilities: DateInterval[]
) {
  if (!day) return [];
  const timeslots: DateInterval[] = [];
  for (let avail of weeklyAvailabilities) {
    if (getDay(avail.startTime) === getDay(day)) {
      let d = avail.startTime;
      let n = 1;
      while (isBefore(addMinutes(d, minutesPerTimeslot * n), avail.endTime)) {
        timeslots.push({
          startTime: addMinutes(d, minutesPerTimeslot * (n - 1)),
          endTime: addMinutes(d, minutesPerTimeslot * n),
        });
        n += 1;
      }
    }
  }

  return timeslots;
}

interface BookAChatProps {
  mentor: MentorProfile;
}
const BookAChat = ({ mentor }: BookAChatProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const { data, error } = useGetWeeklyAvailabilitiesQuery({
    variables: { profileId: mentor.profileId },
  });

  let weeklyAvailabilities: DateInterval[] = [];
  if (!error && data) {
    weeklyAvailabilities = data.getWeeklyAvailabilities.map((x) => ({
      startTime: new Date(x.startTime),
      endTime: new Date(x.endTime),
    }));
  }

  console.log(weeklyAvailabilities);

  const timeslots = generateTimeslots(selectedDay, 15, weeklyAvailabilities);
  console.log(timeslots);

  return (
    <div>
      <div className="h-4"></div>
      <Text b1>
        Book a chat with {mentor.user.firstName} {mentor.user.lastName}
      </Text>
      <div className="h-8"></div>

      <div className="flex">
        <Calendar
          availabilities={{
            weekly: weeklyAvailabilities,
            overrides: [],
          }}
          onSelect={(newSelectedDay) => {
            setSelectedDay(newSelectedDay);
          }}
          selectedDay={selectedDay}
        />
        <div className="w-8"></div>
        <Card>
          <Text b>
            {selectedDay && dateFormat(selectedDay, "dddd, mmmm dS, yyyy")}
          </Text>
          <div className="h-2"></div>
          {timeslots.map((timeslot) => {
            return (
              <div>
                {dateFormat(timeslot.startTime, "h:MM TT")} -{" "}
                {dateFormat(timeslot.endTime, "h:MM TT")}
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};

enum ProfileModalStage {
  VIEW_PROFILE = "VIEW_PROFILE",
  BOOK_CHAT = "BOOK_CHAT",
}
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: MentorProfile;
}
const ProfileModal = ({
  isOpen,
  onClose = () => {},
  mentor,
}: ProfileModalProps) => {
  const [stage, setStage] = useState(ProfileModalStage.VIEW_PROFILE);

  useEffect(() => {
    if (isOpen === true) setStage(ProfileModalStage.BOOK_CHAT);
    return () => {};
  }, [isOpen]);

  const renderModalContents = () => {
    switch (stage) {
      case ProfileModalStage.VIEW_PROFILE:
        return (
          <Fragment>
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
                <Button
                  size="small"
                  onClick={() => {
                    setStage(ProfileModalStage.BOOK_CHAT);
                  }}
                >
                  Book a Chat
                </Button>
                <div className="w-2"></div>
                <Button size="small" variant="inverted">
                  Request Mentor
                </Button>
              </div>
            </div>
          </Fragment>
        );
      case ProfileModalStage.BOOK_CHAT:
        return (
          <div>
            <Button
              onClick={() => {
                setStage(ProfileModalStage.VIEW_PROFILE);
              }}
              size="small"
            >
              Back
            </Button>
            <BookAChat mentor={mentor} />
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <div className="flex p-4">{renderModalContents()}</div>
    </Modal>
  );
};

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
    <Card className="flex flex-col p-6 place-items-center border-0">
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
      <div className="h-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
