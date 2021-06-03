import React, { useState } from "react";
import Calendar from "../../components/Calendar";

const TestPage = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  return (
    <div className="flex justify-center items-center">
      <Calendar
        onSelect={(day) => {
          setSelectedDay(day);
        }}
        availabilities={SAMPLE_AVAILABILITIES}
        selectedDay={selectedDay}
      ></Calendar>
    </div>
  );
};

export default TestPage;

const SAMPLE_AVAILABILITIES = {
  weekly: {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  },
  overrides: [],
};
