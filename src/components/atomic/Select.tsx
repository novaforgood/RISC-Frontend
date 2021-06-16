import { Listbox, Transition } from "@headlessui/react";
import { isEqual } from "date-fns";
import { Fragment } from "react";

interface UpDownArrowProps {}
const UpDownArrow: React.FC<UpDownArrowProps> = () => {
  return (
    <svg
      className="h-5 w-5 text-secondary"
      x-description="Heroicon name: solid/selector"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

interface SelectProps<T> {
  options: { label: string; value: T }[];
  value: T;
  onSelect?: (selectedValue: T) => void;
}
const Select = <T extends string | Date>({
  options,
  value,
  onSelect = () => {},
}: SelectProps<T>) => {
  const valueToLabel = (value: T) => {
    return options.find((x) =>
      x.value instanceof Date && value instanceof Date
        ? isEqual(x.value, value)
        : x.value === value
    )?.label;
  };

  return (
    <div className="w-auto">
      <Listbox
        value={value}
        onChange={(selectedValue) => {
          onSelect(selectedValue);
        }}
      >
        <div className="relative">
          <Listbox.Button
            className="relative w-full px-2 py-1 text-left border border-inactive rounded cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-inactive focus:border-inactive flex justify-between items-center"
          >
            <span className="block truncate">{valueToLabel(value)}</span>
            <UpDownArrow />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white z-20
              rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {options.map((option, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `${
                      active && "bg-tertiary"
                    } cursor-pointer select-none relative px-2 py-1`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <span
                      className={`${
                        selected ? "font-medium" : "font-normal"
                      } block truncate`}
                    >
                      {option.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Select;
