import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { ReactNode, useState } from "react";

type OmegaTextFieldProps = TextFieldProps & {
  startIcon?: ReactNode;
};

export default function OmegaTextField({
  label,
  placeholder,
  startIcon,
  type,
  ...props
}: OmegaTextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <TextField
      variant="outlined"
      placeholder={(placeholder ?? label) as string}
      type={isPassword ? (showPassword ? "text" : "password") : type}
      slotProps={{
        input: {
          startAdornment: startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : undefined,
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOff sx={{ color: "#9e9e9e" }} />
                ) : (
                  <Visibility sx={{ color: "#9e9e9e" }} />
                )}
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
      {...props}
    />
  );
}
