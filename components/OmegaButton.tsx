import { Button, ButtonProps, CircularProgress, styled } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
	borderRadius: '999px',
	textTransform: 'none',
	fontSize: '1rem',
	padding: '12px 0'
}));

const buttonStyles = {
	confirm: {
		backgroundColor: '#00BFA5',
		color: '#ffffff',
		'&:hover': {
			backgroundColor: '#00A896'
		},
		'&.Mui-disabled': {
			backgroundColor: '#00BFA5',
			color: '#ffffff'
		}
	},
	back: {
		backgroundColor: '#2a2d3e',
		color: '#ffffff',
		'&:hover': {
			backgroundColor: '#353849'
		}
	}
};

type OmegaButtonVariant = 'confirm' | 'back';

type OmegaButtonProps = ButtonProps & {
	omegaVariant?: OmegaButtonVariant;
	loading?: boolean;
};

export default function OmegaButton({ omegaVariant = 'confirm', loading, children, ...props }: OmegaButtonProps) {
	return (
		<StyledButton variant="contained" disabled={loading} sx={buttonStyles[omegaVariant]} {...props}>
			{loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : children}
		</StyledButton>
	);
}
