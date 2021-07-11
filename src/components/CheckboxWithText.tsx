import { Checkbox, Text } from "./atomic";

type CheckboxWithTextProps = {
  checked: boolean;
  onCheck: (checked: boolean) => void;
  text: string;
};

const CheckboxWithText = ({
  checked,
  onCheck,
  text,
}: CheckboxWithTextProps) => (
  <div className="flex inline space-x-2 items-center">
    <Checkbox checked={checked} onCheck={onCheck} />
    <Text b2>{text}</Text>
  </div>
);

export default CheckboxWithText;
