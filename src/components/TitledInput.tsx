import { ComponentProps } from "react";
import Input from "./atomic/Input";
import Text from "./atomic/Text";

type TitledInputProps = {
  title: string;
} & ComponentProps<typeof Input>;

const TitledInput = ({ title, className, ...props }: TitledInputProps) => {
  return (
    <div className={className}>
      <Text b>{title}</Text>
      <div className="h-1" />
      <Input className="w-full" {...props}></Input>
    </div>
  );
};

export default TitledInput;
