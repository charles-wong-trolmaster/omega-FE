import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';

interface SignUpUserProps {
	navigateTo: (component: string) => void;
}

const SignUpUser: React.FC<SignUpUserProps> = ({ navigateTo }) => {
	return (
		<Stack direction="column" spacing={5}>
			<Typography variant="h1" sx={{ fontWeight: 'bold' }}>
				Already a TrolMaster User?
			</Typography>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<img src="/img/tm+ProIcon.svg" alt="logo" width="80" />
				<Typography variant="h2" sx={{ fontWeight: 'bold' }}>
					TM+ PRO APP
				</Typography>
			</Box>
			<Button
				variant="outlined"
				size="large"
				fullWidth
				onClick={(e) => {
					e.preventDefault();
					navigateTo('signInTMPro');
				}}
			>
				Yes
			</Button>
			<Button
				variant="outlined"
				size="large"
				fullWidth
				onClick={(e) => {
					e.preventDefault();
					navigateTo('signUpBoth');
				}}
			>
				No
			</Button>
			<Button
				variant="contained"
				color="primary"
				size="large"
				fullWidth
				onClick={(e) => {
					e.preventDefault();
					navigateTo('login');
				}}
			>
				Back
			</Button>
		</Stack>
	);
};

export default SignUpUser;
