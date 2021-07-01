import React, { HTMLAttributes } from "react";
import { Button } from "./atomic";

type UploadIconWithPreviewProps = HTMLAttributes<HTMLDivElement> & {
  onFileChanged: (file: File | null) => void;
  src?: string;
  onSrcChange: (src: string) => void;
};

const UploadIconWithPreview = ({
  onFileChanged,
  src,
  onSrcChange,
}: UploadIconWithPreviewProps) => (
  <div className="flex items-center">
    <img alt={src} className="object-cover rounded-md w-20 h-20" src={src} />
    <div className="w-10" />

    <Button variant="inverted" size="small">
      <label>
        <input
          onChange={(e) => {
            const file = e.target.files![0];
            const url = URL.createObjectURL(file);
            onFileChanged(file);
            onSrcChange(url);
            e.target.value = "";
          }}
          className="hidden"
          type="file"
          accept="image/*"
        />
        <div className="w-full h-full flex items-center justify-center cursor-pointer">
          Choose File
        </div>
      </label>
    </Button>
  </div>
);

export default UploadIconWithPreview;
