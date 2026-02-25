import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@mui/material";

interface SwitcherOption<T extends string> {
  label: string;
  value: T;
}

interface OmegaSwitcherProps<T extends string> extends Omit<
  ToggleButtonGroupProps,
  "value" | "onChange"
> {
  options: SwitcherOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const OmegaSwitcher = <T extends string>({
  options,
  value,
  onChange,
  ...rest
}: OmegaSwitcherProps<T>) => {
  const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: T) => {
    if (newValue !== null) onChange(newValue);
  };

  return (
    <ToggleButtonGroup value={value} onChange={handleChange} {...rest}>
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default OmegaSwitcher;
