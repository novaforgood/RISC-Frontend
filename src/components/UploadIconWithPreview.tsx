import React, { HTMLAttributes, useState } from "react";
import { Button } from "./atomic";

type UploadIconWithPreviewProps = HTMLAttributes<HTMLDivElement> & {
  onFileChanged: (file: File | null) => void;
  onErrorOccured: (error: string) => void;
  initialSrc?: string;
};

const UploadIconWithPreview = ({
  onFileChanged,
  onErrorOccured,
  initialSrc,
}: UploadIconWithPreviewProps) => {
  const [src, setSrc] = useState(initialSrc || "/static/DefaultLogo.svg");

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
                onFileChanged(file);
                setSrc(url);
              } else {
                onErrorOccured("The uploaded file was invalid.");
              }
            }}
            className="hidden overflow-ellipsis"
            type="file"
            accept="image/*"
          />
          <div className="w-full h-full p-4 flex items-center justify-center cursor-pointer">
            Upload
          </div>
        </label>
      </Button>
    </div>
  );
};

export default UploadIconWithPreview;
