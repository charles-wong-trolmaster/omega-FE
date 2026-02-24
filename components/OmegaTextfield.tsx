import { InputAdornment, TextField as MuiTextField, styled, TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
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

type OmegaTextFieldProps = TextFieldProps & {
	startIcon?: ReactNode;
};

export default function OmegaTextField({ label, placeholder, startIcon, ...props }: OmegaTextFieldProps) {
	return (
		<StyledTextField
			variant="outlined"
			placeholder={(placeholder ?? label) as string}
			InputProps={{
				startAdornment: startIcon ? <InputAdornment position="start">{startIcon}</InputAdornment> : undefined,
				...props.InputProps
			}}
			{...props}
		/>
	);
}
