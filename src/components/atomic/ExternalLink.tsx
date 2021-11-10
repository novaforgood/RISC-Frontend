import React, { AnchorHTMLAttributes } from "react";

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

// This external link is for creating links that open in a new tab
// Noopener Noreferrer: https://www.freecodecamp.org/news/how-to-use-html-to-open-link-in-new-tab/
const ExternalLink = ({ className, ...props }: ExternalLinkProps) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    className={`${className} hover:underline cursor:pointer`}
    {...props}
  ></a>
);

export default ExternalLink;
