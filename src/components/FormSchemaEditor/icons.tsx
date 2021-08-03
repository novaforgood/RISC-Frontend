import React, { HTMLAttributes } from "react";

export const EditIcon = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100%"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M15.5833 2.75011C15.8241 2.50936 16.1099 2.31838 16.4245 2.18808C16.7391 2.05779 17.0762 1.99072 17.4167 1.99072C17.7572 1.99072 18.0943 2.05779 18.4089 2.18808C18.7234 2.31838 19.0093 2.50936 19.25 2.75011C19.4908 2.99087 19.6818 3.27669 19.812 3.59125C19.9423 3.90582 20.0094 4.24297 20.0094 4.58345C20.0094 4.92393 19.9423 5.26108 19.812 5.57564C19.6818 5.8902 19.4908 6.17602 19.25 6.41678L6.87501 18.7918L1.83334 20.1668L3.20834 15.1251L15.5833 2.75011Z"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const DeleteIcon = (props: HTMLAttributes<HTMLDivElement>) => {
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
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5M17 5V19C17 19.5304 16.7893 20.0391 16.4142 20.4142C16.0391 20.7893 15.5304 21 15 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5H17Z"
          stroke="#DB3B25"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 10V16"
          stroke="#DB3B25"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 10V16"
          stroke="#DB3B25"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const DragHandle = (props: HTMLAttributes<HTMLDivElement>) => {
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
