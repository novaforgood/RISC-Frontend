import classNames from "classnames";
import React from "react";

interface ProfilePictureImgProps {
  src: string | undefined;
  className?: string;
  alt?: string;
}

function ProfilePictureImg({ src, className, alt }: ProfilePictureImgProps) {
  if (!src || src === "") {
    src = "/static/HappyBlobs.svg";
  }
  return (
    <div
      className={classNames(
        "h-10 w-10 flex-shrink-0 rounded-full object-cover bg-tertiary border border-inactive",
        className
      )}
    >
      <img className="h-full w-full rounded-full" src={src} alt={alt} />
    </div>
  );
}

export default ProfilePictureImg;
