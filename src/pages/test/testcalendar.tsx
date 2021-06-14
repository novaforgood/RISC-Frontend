import React, { useState } from "react";
import { Text } from "../../components/atomic";
import Calendar from "../../components/Calendar";

var start = new Date();
start.setHours(0, 0, 0, 0);

const TestPage = () => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedDay2, setSelectedDay2] = useState<Date | null>(null);
  return (
    <div className="w-screen h-screen flex flex-col justify-start items-center">
      <div className="h-10"></div>
      <Text>Select only available dates</Text>
      <div className="h-10"></div>

      <Calendar
        onSelect={(day) => {
          setSelectedDay(day);
        }}
        availabilities={SAMPLE_AVAILABILITIES}
        selectedDay={selectedDay}
      />
      <div className="h-10"></div>
      <Text>Select any date</Text>
      <div className="h-10"></div>

      <Calendar
        onSelect={(day) => {
          setSelectedDay2(day);
        }}
        selectAnyDay
        availabilities={SAMPLE_AVAILABILITIES}
        selectedDay={selectedDay2}
      />
    </div>
  );
};

export default TestPage;

const SAMPLE_AVAILABILITIES = {
  weekly: [[{ start: new Date(), end: new Date() }], [], [], [], [], [], []], // Sunday thru Saturday
  overrides: [{ start: new Date(), end: new Date() }],
};
