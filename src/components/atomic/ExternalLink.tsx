import React, { AnchorHTMLAttributes } from "react";

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const ExternalLink = ({ className, ...props }: ExternalLinkProps) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    className={`${className} cursor:pointer`}
    {...props}
  ></a>
);

export default ExternalLink;
