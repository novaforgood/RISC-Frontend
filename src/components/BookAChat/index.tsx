import { addMinutes } from "date-fns";
import dateFormat from "dateformat";
import _ from "lodash";
import React, { Fragment, useMemo, useState } from "react";
import {
  CreateChatRequestInput,
  DateInterval,
  GetProfilesQuery,
  refetchGetChatRequestsQuery,
  useCreateChatRequestMutation,
  useGetAvailOverrideDatesQuery,
  useGetAvailWeeklysQuery,
  useGetChatRequestsQuery,
} from "../../generated/graphql";
import useTimezoneConverters from "../../hooks/useTimezoneConverters";
import { Button, Card, Modal, Text, TextArea } from "../atomic";
import Calendar from "../Calendar";
import { getDatesInThisMonth } from "../Calendar/utils";
import OneOptionModal from "../OneOptionModal";
import { mergeIntervalLists } from "./utils";

type MentorProfile = GetProfilesQuery["getProfiles"][number];

function intervalsToTimeslots(
  minutesPerTimeslot: number,
  dateIntervals: DateInterval[]
): DateInterval[] {
  const timeslots: DateInterval[] = [];
  for (let interval of dateIntervals) {
    let d = interval.startTime;
    let n = 1;
    while (addMinutes(d, minutesPerTimeslot * n) <= interval.endTime) {
      timeslots.push({
        startTime: addMinutes(d, minutesPerTimeslot * (n - 1)),
        endTime: addMinutes(d, minutesPerTimeslot * n),
      });
      n += 1;
    }
  }

  return timeslots;
}

function generateWeeklyTimeslotsOnDate(
  date: Date | null,
  minutesPerTimeslot: number,
  weeklyAvailabilities: DateInterval[]
) {
  if (!date) return [];
  let timeslots: DateInterval[] = [];
  for (let avail of weeklyAvailabilities) {
    let d = avail.startTime;
    let n = 1;
    while (addMinutes(d, minutesPerTimeslot * n) <= avail.endTime) {
      const start = addMinutes(d, minutesPerTimeslot * (n - 1));
      const end = addMinutes(d, minutesPerTimeslot * n);
      if (start.getDay() === date.getDay())
        timeslots.push({
          startTime: start,
          endTime: end,
        });
      n += 1;
    }
  }

  const [d, m, y] = [date.getDate(), date.getMonth(), date.getFullYear()];

  return timeslots.map((t) => {
    let temp = t;
    temp.startTime.setFullYear(y);
    temp.startTime.setMonth(m);
    temp.startTime.setDate(d);
    temp.endTime.setFullYear(y);
    temp.endTime.setMonth(m);
    temp.endTime.setDate(d);
    return temp;
  });
}

interface BookAChatProps {
  mentor: MentorProfile;
}
const BookAChat = ({ mentor }: BookAChatProps) => {
  const { fromUTC, toUTC } = useTimezoneConverters();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState<DateInterval | null>(
    null
  );
  const [sendChatModalOpen, setSendChatModalOpen] = useState(false);
  const [chatSentConfirmModalOpen, setChatSentConfirmModalOpen] =
    useState(false);
  const { data: availWeeklyData, error: availWeeklyError } =
    useGetAvailWeeklysQuery({
      variables: { profileId: mentor.profileId },
    });
  const { data: availOverrideDateData, error: availOverrideDateError } =
    useGetAvailOverrideDatesQuery({
      variables: { profileId: mentor.profileId },
    });
  const { data: mentorChatRequestData, error: mentorChatRequestError } =
    useGetChatRequestsQuery({
      variables: { profileId: mentor.profileId },
    });

  const [createChatRequest] = useCreateChatRequestMutation({
    refetchQueries: [
      refetchGetChatRequestsQuery({
        profileId: mentor.profileId,
      }),
    ],
  });
  const [loadingCreateChatRequest, setLoadingCreateChatRequest] =
    useState(false);
  const [chatRequestMessage, setChatRequestMessage] = useState("");

  loadingCreateChatRequest; // TODO: Use this variable

  if (!fromUTC || !toUTC) return <Fragment />;

  const extractDates = (
    input: {
      startTime: number;
      endTime: number;
    }[]
  ): DateInterval[] => {
    return input.map((d) => ({
      startTime: fromUTC(new Date(d.startTime)),
      endTime: fromUTC(new Date(d.endTime)),
    }));
  };

  let weeklyAvailabilities: DateInterval[] = [];
  let availOverrideDates: DateInterval[] = [];
  let availOverrideTimeslots: DateInterval[] = [];
  let mentorChatTimeslots: DateInterval[] = [];

  if (!availWeeklyError && availWeeklyData) {
    weeklyAvailabilities = extractDates(availWeeklyData.getAvailWeeklys);
  }
  if (!availOverrideDateError && availOverrideDateData) {
    availOverrideDates = extractDates(
      availOverrideDateData.getAvailOverrideDates
    );
    availOverrideDateData.getAvailOverrideDates.forEach((availDate) => {
      availOverrideTimeslots = availOverrideTimeslots.concat(
        extractDates(availDate.availOverrideTimeslots)
      );
    });
  }

  if (!mentorChatRequestError && mentorChatRequestData) {
    mentorChatTimeslots = mentorChatRequestData.getChatRequests.map(
      (chatRequest) => {
        return {
          startTime: fromUTC(new Date(chatRequest.chatStartTime)),
          endTime: fromUTC(new Date(chatRequest.chatEndTime)),
        };
      }
    );
  }

  /**
   *
   * @param allIntervals Initial set of intervals to be filtered
   *
   * @returns Given a set of intervals, returns a set of intervals with
   * override times added in but unavailable times filtered out.
   */
  const modifyAvailableIntervals = (allIntervals: DateInterval[]) => {
    // Subtract days that are overridden
    let ret = mergeIntervalLists(
      allIntervals,
      availOverrideDates,
      (inA, inB) => inA && !inB
    );

    // Add back special override timeslots
    ret = mergeIntervalLists(
      ret,
      availOverrideTimeslots,
      (inA, inB) => inA || inB
    );

    // Subtract times where mentor has already accepted a chat
    // TODO: Subtract times only if accepted (right now it subtracts if you request)
    ret = mergeIntervalLists(
      ret,
      mentorChatTimeslots,
      (inA, inB) => inA && !inB
    );
    return ret;
  };

  const timeslots = useMemo(() => {
    const availableIntervals = modifyAvailableIntervals(
      generateWeeklyTimeslotsOnDate(selectedDate, 30, weeklyAvailabilities)
    );
    const currTime = new Date();
    return intervalsToTimeslots(30, availableIntervals)
      .filter((slot) => slot.startTime.getDate() === selectedDate?.getDate())
      .filter((slot) => slot.startTime > currTime);
  }, [
    selectedDate,
    weeklyAvailabilities,
    availOverrideDates,
    availOverrideTimeslots,
  ]);

  return (
    <div className="w-full">
      <div className="h-4"></div>
      <Text h2>
        Book a chat with{" "}
        <b>
          {mentor.user.firstName} {mentor.user.lastName}
        </b>
      </Text>
      <div className="h-2"></div>
      <Text className="text-secondary">
        If no times are open, the mentor is either completely booked or has not
        set availabilities yet.
      </Text>
      <div className="h-8"></div>

      <div className="flex flex-col md:flex-row w-full">
        <Card className="md:p-12">
          <Calendar
            onSelect={(newSelectedDate) => {
              setSelectedDate(newSelectedDate);
            }}
            selectedDate={selectedDate}
            getSelectableDates={(month, year) => {
              const dates = getDatesInThisMonth(month, year);
              let allTimeslots: DateInterval[] = [];
              for (let date of dates) {
                const t = generateWeeklyTimeslotsOnDate(
                  date,
                  30,
                  weeklyAvailabilities
                );
                allTimeslots = allTimeslots.concat(t);
              }
              const selectableDates = intervalsToTimeslots(
                30,
                modifyAvailableIntervals(allTimeslots)
              )
                .map((slot) => slot.startTime)
                .filter(
                  (d) => d.getMonth() === month && d.getFullYear() === year
                );

              return selectableDates;
            }}
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
              {selectedDate
                ? dateFormat(selectedDate, "dddd, mmmm dS, yyyy")
                : "Select a day to see slots"}
            </Text>
          </div>

          <div className="h-4"></div>
          <div className="h-80 box-border flex flex-col gap-2 overflow-y-auto">
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
          <TextArea
            value={chatRequestMessage}
            onChange={(e: any) => {
              const target = e.target as HTMLTextAreaElement;
              setChatRequestMessage(target.value);
            }}
            className="md:p-2 md:w-96"
            placeholder="Suggest a location (Zoom link, in person address, etc.) and leave an optional message."
          ></TextArea>
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
                  chatStartTime: toUTC(selectedTimeslot.startTime).getTime(),
                  chatEndTime: toUTC(selectedTimeslot.endTime).getTime(),
                };
                createChatRequest({
                  variables: {
                    data: createChatRequestInput,
                  },
                }).then(() => {
                  setLoadingCreateChatRequest(false);
                  setSendChatModalOpen(false);
                  _.delay(setChatSentConfirmModalOpen, 250, true);
                });
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </Modal>
      <OneOptionModal
        isOpen={chatSentConfirmModalOpen}
        onClose={() => setChatSentConfirmModalOpen(false)}
        title="Request Sent! ????"
        buttonText="Close"
        onButtonClick={() => {
          setChatSentConfirmModalOpen(false);
        }}
      >
        <Text>
          Your chat request has been sent! You will receive an email when this
          mentor accepts or declines the chat.
        </Text>
      </OneOptionModal>
    </div>
  );
};

export default BookAChat;
