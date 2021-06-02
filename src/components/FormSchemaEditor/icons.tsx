import React, { HTMLAttributes } from "react";

type DeleteIconProps = HTMLAttributes<HTMLDivElement>;
export const DeleteIcon: React.FC<DeleteIconProps> = (props) => {
  return (
    <div {...props}>
      <svg
        height="100%"
        viewBox="0 0 20 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 5H3H19"
          stroke="#DB3B25"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5M17 5V19C17 19.5304 16.7893 20.0391 16.4142 20.4142C16.0391 20.7893 15.5304 21 15 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5H17Z"
          stroke="#DB3B25"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 10V16"
          stroke="#DB3B25"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12 10V16"
          stroke="#DB3B25"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

type DragHandleProps = HTMLAttributes<HTMLDivElement>;
export const DragHandle: React.FC<DragHandleProps> = (props) => {
  return (
    <div {...props}>
      <svg
        width="8"
        height="13"
        viewBox="0 0 8 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="1.25"
          cy="11.75"
          r="1.25"
          transform="rotate(-90 1.25 11.75)"
          fill="#737373"
        />
        <circle
          cx="6.25"
          cy="11.75"
          r="1.25"
          transform="rotate(-90 6.25 11.75)"
          fill="#737373"
        />
        <circle
          cx="1.25"
          cy="6.75"
          r="1.25"
          transform="rotate(-90 1.25 6.75)"
          fill="#737373"
        />
        <circle
          cx="6.25"
          cy="6.75"
          r="1.25"
          transform="rotate(-90 6.25 6.75)"
          fill="#737373"
        />
        <circle
          cx="1.25"
          cy="1.75"
          r="1.25"
          transform="rotate(-90 1.25 1.75)"
          fill="#737373"
        />
        <circle
          cx="6.25"
          cy="1.75"
          r="1.25"
          transform="rotate(-90 6.25 1.75)"
          fill="#737373"
        />
      </svg>
    </div>
  );
};
