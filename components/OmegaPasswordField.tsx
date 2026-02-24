import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment, styled, TextField, TextFieldProps } from '@mui/material';
import { ReactNode, useState } from 'react';

const OmegaTextField = styled(TextField)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		backgroundColor: '#ffffff',
		borderRadius: '999px'
	},
	'& .MuiFormHelperText-root.Mui-focused': {
		color: '#ffffff'
	},
	'& .MuiOutlinedInput-notchedOutline legend': {
		display: 'none'
	},
	'& .MuiOutlinedInput-notchedOutline': {
		top: 0
	}
}));

type OmegaPasswordFieldProps = Omit<TextFieldProps, 'type'> & {
	startIcon?: ReactNode;
};

export default function OmegaPasswordField({ startIcon, placeholder, ...props }: OmegaPasswordFieldProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<OmegaTextField
			{...props}
			type={showPassword ? 'text' : 'password'}
			placeholder={placeholder as string}
			InputProps={{
				startAdornment: startIcon ? <InputAdornment position="start">{startIcon}</InputAdornment> : undefined,
				endAdornment: (
					<InputAdornment position="end">
						<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
							{showPassword ? <VisibilityOff sx={{ color: '#9e9e9e' }} /> : <Visibility sx={{ color: '#9e9e9e' }} />}
						</IconButton>
					</InputAdornment>
				)
			}}
		/>
	);
}
