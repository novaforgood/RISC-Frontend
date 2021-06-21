import { addMinutes, getDay } from "date-fns";
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
import Form, { ResponseJson } from "../../../../components/Form";
import {
  CreateChatRequestInput,
  DateInterval,
  GetProfilesQuery,
  Maybe,
  ProfileType,
  MailCodes,
  useCreateChatRequestMutation,
  useGetProfilesQuery,
  useGetWeeklyAvailabilitiesQuery,
  useSendEmailMutation,
  UpdateProgramInput,
} from "../../../../generated/graphql";
import {
  AuthorizationLevel,
  useAuthorizationLevel,
  useCurrentProgram,
} from "../../../../hooks";
import ChooseTabLayout from "../../../../layouts/ChooseTabLayout";
import PageContainer from "../../../../layouts/PageContainer";
import { Question } from "../../../../types/Form";
import Page from "../../../../types/Page";

function getQuestionsFromJson(json: string | undefined): Question[] {
  if (!json) return [];
  try {
    return JSON.parse(json) as Question[];
  } catch (e) {
    return [];
  }
}

function getResponsesFromJson(json: Maybe<string> | undefined): ResponseJson {
  if (!json) return {};
  try {
    return JSON.parse(json) as ResponseJson;
  } catch (e) {
    return {};
  }
}

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
      while (addMinutes(d, minutesPerTimeslot * n) <= avail.endTime) {
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
  programId: string;
}
const BookAChat = ({ mentor, programId }: BookAChatProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTimeslot, setSelectedTimeslot] =
    useState<DateInterval | null>(null);
  const [sendChatModalOpen, setSendChatModalOpen] = useState(false);
  const { data, error } = useGetWeeklyAvailabilitiesQuery({
    variables: { profileId: mentor.profileId },
  });

  const [createChatRequest] = useCreateChatRequestMutation();
  const [loadingCreateChatRequest, setLoadingCreateChatRequest] =
    useState(false);
  const [chatRequestMessage, setChatRequestMessage] = useState("");
  let weeklyAvailabilities: DateInterval[] = [];
  if (!error && data) {
    weeklyAvailabilities = data.getWeeklyAvailabilities.map((x) => ({
      startTime: new Date(x.startTime),
      endTime: new Date(x.endTime),
    }));
  }

  const [sendEmail] = useSendEmailMutation();

  loadingCreateChatRequest; // TODO: Use this variable

  const timeslots = generateTimeslots(selectedDay, 30, weeklyAvailabilities);

  return (
    <div>
      <div className="h-4"></div>
      <Text h2>
        Book a chat with{" "}
        <b>
          {mentor.user.firstName} {mentor.user.lastName}
        </b>
      </Text>
      <div className="h-8"></div>

      <div className="flex">
        <Card className="p-12">
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
        </Card>

        <div className="w-8"></div>
        <Card className="p-12 w-80">
          <div>
            <Text b1 b>
              Available Times
            </Text>
          </div>
          <div className="h-2"></div>
          <div>
            <Text b className="text-secondary">
              {selectedDay
                ? dateFormat(selectedDay, "dddd, mmmm dS, yyyy")
                : "Select a day to see slots"}
            </Text>
          </div>

          <div className="h-4"></div>
          <div className="h-80 box-border flex flex-col gap-2 overflow-y-scroll">
            {timeslots.map((timeslot) => {
              return (
                <button
                  className="border border-inactive text-center w-full p-2 cursor-pointer hover:border-primary duration-150"
                  onClick={() => {
                    setSendChatModalOpen(true);
                    setSelectedTimeslot(timeslot);
                    setChatRequestMessage("");
                  }}
                >
                  {dateFormat(timeslot.startTime, "h:MMtt")} -{" "}
                  {dateFormat(timeslot.endTime, "h:MMtt")}
                </button>
              );
            })}
          </div>
        </Card>
      </div>
      <Modal
        isOpen={sendChatModalOpen}
        onClose={() => {
          setSendChatModalOpen(false);
        }}
      >
        <div className="p-4 flex flex-col items-center">
          <div>
            <Text>
              Send Chat Request to{" "}
              <Text b>
                {mentor.user.firstName} {mentor.user.lastName}
              </Text>
            </Text>
          </div>
          <div className="h-2"></div>
          <div>
            <Text b>Date:</Text>{" "}
            <Text>
              {dateFormat(selectedTimeslot?.startTime, "dddd, mmmm dS, yyyy")}
            </Text>
          </div>
          <div>
            <Text b>Time:</Text>{" "}
            <Text>
              {dateFormat(selectedTimeslot?.startTime, "h:MMtt")} -{" "}
              {dateFormat(selectedTimeslot?.endTime, "h:MMtt")}
            </Text>
          </div>
          <div className="h-6"></div>

          <textarea
            value={chatRequestMessage}
            onChange={(e) => {
              setChatRequestMessage(e.target.value);
            }}
            className="p-2 w-96 shadow-sm focus:ring-secondary focus:border-primary mt-1 block sm:text-sm border border-secondary rounded-md"
            placeholder="Optional message"
          ></textarea>
          <div className="h-8"></div>

          <div className="flex">
            <Button
              variant="inverted"
              size="small"
              onClick={() => {
                setSendChatModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <div className="w-2"></div>
            <Button
              size="small"
              onClick={() => {
                if (!selectedTimeslot) return; // TODO: Set error
                setLoadingCreateChatRequest(true);
                const createChatRequestInput: CreateChatRequestInput = {
                  mentorProfileId: mentor.profileId,
                  chatRequestMessage: chatRequestMessage,
                  chatStartTime: selectedTimeslot.startTime.getTime(),
                  chatEndTime: selectedTimeslot.endTime.getTime(),
                };
                createChatRequest({
                  variables: {
                    data: createChatRequestInput,
                  },
                }).then(() => {
                  setLoadingCreateChatRequest(false);
                  setSendChatModalOpen(false);
                });
                sendEmail({
                  variables: {
                    email: mentor.user.email,
                    code: MailCodes.BOOK_CHAT,
                    programId: programId,
                    name: `${mentor.user.firstName} ${mentor.user.lastName}`,
                  },
                });
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </Modal>
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
  const { currentProgram } = useCurrentProgram();
  const authorizationLevel = useAuthorizationLevel();

  useEffect(() => {
    if (isOpen === true) setStage(ProfileModalStage.VIEW_PROFILE);
    return () => {};
  }, [isOpen]);

  const renderModalContents = () => {
    switch (stage) {
      case ProfileModalStage.VIEW_PROFILE:
        return (
          <div>
            <div className="flex">
              <div className="flex flex-col items-center">
                <div className="h-40 w-40 rounded-full bg-tertiary object-cover overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={mentor.user.profilePictureUrl}
                  />
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
                    disabled={authorizationLevel !== AuthorizationLevel.Mentee}
                    onClick={() => {
                      setStage(ProfileModalStage.BOOK_CHAT);
                    }}
                  >
                    Book a Chat
                  </Button>
                  <div className="w-2"></div>
                  <Button
                    size="small"
                    variant="inverted"
                    disabled={authorizationLevel !== AuthorizationLevel.Mentee}
                  >
                    Request Mentor
                  </Button>
                  <button />
                </div>
              </div>
            </div>
            <div className="h-12"></div>
            <Form
              questions={getQuestionsFromJson(
                currentProgram?.mentorProfileSchemaJson
              )}
              responses={getResponsesFromJson(mentor.profileJson)}
              readonly
              showDescriptions={false}
            />
          </div>
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
            <BookAChat mentor={mentor} program={currentProgram} />
          </div>
        );
    }
  };

  return (
    <Modal
      backgroundColor={
        stage === ProfileModalStage.BOOK_CHAT ? "tertiary" : "white"
      }
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

  const { currentProgram } = useCurrentProgram();
  const { data } = useGetProfilesQuery({
    variables: {
      programId: currentProgram?.programId!,
      profileType: ProfileType.Mentee,
    },
  });
  const mentors = data?.getProfiles;

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
