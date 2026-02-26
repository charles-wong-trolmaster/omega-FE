import { Box, Button, Typography } from '@mui/material';
import React from 'react';

interface AllSetProps {
	navigateTo: (component: string) => void;
}

const AllSet: React.FC<AllSetProps> = ({ navigateTo }) => {
	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Box sx={{ textAlign: 'center' }}>
				<Box sx={{ marginBottom: '30px' }}>
					<Typography variant="h1" sx={{ fontWeight: 'bold' }}>
						All Set! Time to Launch Your Business!
					</Typography>

					<Typography variant="h3" sx={{ marginTop: '20px' }}>
						Congratulations! You have successfully activated the OMEGA service. Omega is now ready to serve your farm.
					</Typography>
				</Box>

				<Box sx={{ margin: '20px 0px' }}>
					<Typography variant="h2">🎉 Let's get started! 🎉</Typography>
				</Box>

				<Box sx={{ marginTop: '40px' }}>
					<Button variant="contained" color="secondary" size="large" fullWidth loading={false} onClick={() => navigateTo('login')}>
						Go to Omega
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default AllSet;
