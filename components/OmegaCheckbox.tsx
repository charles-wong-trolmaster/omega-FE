import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Checkbox, CheckboxProps, FormControlLabel } from "@mui/material";
import { ReactNode } from "react";

type OmegaCheckboxProps = CheckboxProps & {
  label?: ReactNode;
};

export default function OmegaCheckbox({ label, ...props }: OmegaCheckboxProps) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          {...props}
        />
      }
      label={label ?? ""}
    />
  );
}
