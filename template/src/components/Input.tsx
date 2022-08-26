import { ChangeEvent, FC } from "react";

namespace Input {
  export interface Props {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }
}

const Input: FC<Input.Props> = ({ value, onChange }) => {
  return (
    <input
      className="border-2 border-gray-300 rounded-md p-1 w-full"
      type="text"
      value={value}
      onChange={onChange}
    />
  );
};

export { Input };
