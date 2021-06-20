import { addMinutes, getDay } from "date-fns";
import dateFormat from "dateformat";
import React, { useState } from "react";
import {
  CreateChatRequestInput,
  DateInterval,
  GetProfilesQuery,
  useCreateChatRequestMutation,
  useGetAvailWeeklysQuery,
} from "../generated/graphql";
import { Button, Card, Modal, Text } from "./atomic";
import Calendar from "./Calendar";

type MentorProfile = GetProfilesQuery["getProfiles"][number];

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
}
const BookAChat = ({ mentor }: BookAChatProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTimeslot, setSelectedTimeslot] =
    useState<DateInterval | null>(null);
  const [sendChatModalOpen, setSendChatModalOpen] = useState(false);
  const { data, error } = useGetAvailWeeklysQuery({
    variables: { profileId: mentor.profileId },
  });

  const [createChatRequest] = useCreateChatRequestMutation();
  const [loadingCreateChatRequest, setLoadingCreateChatRequest] =
    useState(false);
  const [chatRequestMessage, setChatRequestMessage] = useState("");
  let weeklyAvailabilities: DateInterval[] = [];
  if (!error && data) {
    weeklyAvailabilities = data.getAvailWeeklys.map((x) => ({
      startTime: new Date(x.startTime),
      endTime: new Date(x.endTime),
    }));
  }

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
              overrideDays: [],
              overrideTimeslots: [],
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
