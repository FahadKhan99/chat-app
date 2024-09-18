import ReactSelect, { MultiValue } from "react-select";
import { User } from "@prisma/client";

interface SelectOption {
  value: string; // Or number if IDs are numbers
  label: string;
}

interface Props {
  users: User[];
  label?: string;
  value?: SelectOption[];
  onChange: (value: SelectOption[]) => void;
  options: SelectOption[];
  disabled?: boolean;
}

const Select = ({ label, value, onChange, options, disabled }: Props) => {
  const handleChange = (newValue: MultiValue<SelectOption>) => {
    onChange(newValue as SelectOption[]); // Handle the change, casting to `SelectOption[]`
  };

  return (
    <div className="z-[100] mb-11">
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={handleChange}
          isMulti
          options={options}
          // menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          classNames={{
            control: () => "text-sm",
          }}
        />
      </div>
    </div>
  );
};

export default Select;
