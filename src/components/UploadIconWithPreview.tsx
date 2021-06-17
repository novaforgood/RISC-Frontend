import React, { useState } from "react";
import { Button } from "./atomic";

type UploadIconWithPreviewProps = {
  setFile: (file: File | null) => void;
  setError: (error: string) => void;
};

const UploadIconWithPreview = ({
  setFile,
  setError,
}: UploadIconWithPreviewProps) => {
  const [src, setSrc] = useState("/static/DefaultLogo.svg");

  return (
    <div className="flex items-center">
      <img alt={src} className="object-cover rounded-md w-20 h-20" src={src} />
      <div className="w-10" />

      <Button variant="inverted" size="small">
        <label>
          <input
            onChange={(e) => {
              const file = e.target.files![0];
              const url = URL.createObjectURL(file);
              if (file && file.type.match("image.*")) {
                setFile(file);
                setSrc(url);
              } else {
                setError("The uploaded file was invalid.");
              }
            }}
            className="hidden"
            type="file"
          />
          <div className="w-full h-full flex items-center justify-center cursor-pointer">
            Choose File
          </div>
        </label>
      </Button>
    </div>
  );
};

export default UploadIconWithPreview;
