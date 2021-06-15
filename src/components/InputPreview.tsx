import React, { ChangeEvent, useState } from "react";
import { Button } from "./atomic";

type PreviewInput = {
  setFile(file: File | null): void;
};

const InputPreview = ({ setFile }: PreviewInput) => {
  const [src, setSrc] = useState("/static/DefaultLogo.svg");

  return (
    <div className="flex items-center">
      <img alt={src} className="object-cover rounded-md w-20 h-20" src={src} />
      <div className="w-10" />

      <Button variant="inverted" size="small">
        <label>
          <input
            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files![0];
              const url = URL.createObjectURL(file);
              setFile(file);
              setSrc(url);
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

export default InputPreview;
