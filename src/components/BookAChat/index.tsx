import { addMinutes } from "date-fns";
import dateFormat from "dateformat";
import React, { Fragment, useMemo, useState } from "react";
import {
  CreateChatRequestInput,
  DateInterval,
  GetProfilesQuery,
  useCreateChatRequestMutation,
  useGetAvailOverrideDatesQuery,
  useGetAvailWeeklysQuery,
} from "../../generated/graphql";
import useTimezoneConverters from "../../hooks/useTimezoneConverters";
import { Button, Card, Modal, Text } from "../atomic";
import Calendar from "../Calendar";
import { getDatesInThisMonth } from "../Calendar/utils";
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
  const [selectedTimeslot, setSelectedTimeslot] =
    useState<DateInterval | null>(null);
  const [sendChatModalOpen, setSendChatModalOpen] = useState(false);
  const { data: availWeeklyData, error: availWeeklyError } =
    useGetAvailWeeklysQuery({
      variables: { profileId: mentor.profileId },
    });
  const { data: availOverrideDateData, error: availOverrideDateError } =
    useGetAvailOverrideDatesQuery({
      variables: { profileId: mentor.profileId },
    });

  const [createChatRequest] = useCreateChatRequestMutation();
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

  const timeslots = useMemo(() => {
    let ret = generateWeeklyTimeslotsOnDate(
      selectedDate,
      30,
      weeklyAvailabilities
    );
    ret = mergeIntervalLists(
      ret,
      availOverrideDates,
      (inA, inB) => inA && !inB
    );
    ret = mergeIntervalLists(
      ret,
      availOverrideTimeslots,
      (inA, inB) => inA || inB
    );
    const currTime = new Date();
    return intervalsToTimeslots(30, ret)
      .filter((slot) => slot.startTime.getDate() === selectedDate?.getDate())
      .filter((slot) => slot.startTime > currTime);
  }, [
    selectedDate,
    weeklyAvailabilities,
    availOverrideDates,
    availOverrideTimeslots,
  ]);

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
              const minusOverrideDates = mergeIntervalLists(
                allTimeslots,
                availOverrideDates,
                (inA, inB) => inA && !inB
              );
              const withOverrideTimeslots = mergeIntervalLists(
                minusOverrideDates,
                availOverrideTimeslots,
                (inA, inB) => inA || inB
              );
              const selectableDates = intervalsToTimeslots(
                30,
                withOverrideTimeslots
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

export default BookAChat;
