'use client';

import OmegaTextField from '@/components/OmegaTextfield';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, Button, Link, Stack, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

interface ForgotProps {
	navigateTo: (component: string) => void;
}

interface ForgotFormData {
	email: string;
}

const TMProForgotPassword: React.FC<ForgotProps> = ({ navigateTo }) => {
	const {
		control,
		handleSubmit,
		formState: { isValid, errors }
	} = useForm<ForgotFormData>({
		mode: 'onSubmit',
		defaultValues: {
			email: ''
		}
	});

	const onSubmit = async (data: ForgotFormData) => {
		console.log(data);
	};

	return (
		<Box>
			<Box sx={{ marginBottom: '30px' }}>
				<Typography sx={{ fontWeight: 'bold' }} variant="h1">
					Forgot Password
				</Typography>
			</Box>

			<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
				<Stack spacing={5}>
					<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
						Please provide the email address that you used when signed up for your account. If you forgot your email, please{' '}
						<Link href="#" underline="always" color="#26B2A7">
							contact us
						</Link>
						.
					</Typography>

					<Box>
						<Typography variant="h5" sx={{ marginBottom: '5px' }}>
							Email *
						</Typography>
						<Controller
							name="email"
							control={control}
							rules={{
								required: 'Email is required',
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: 'Invalid email address'
								}
							}}
							render={({ field }) => <OmegaTextField {...field} startIcon={<MailOutlineIcon />} size="small" fullWidth placeholder="Email" error={!!errors.email} helperText={errors.email?.message} />}
						/>
					</Box>

					<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
						You will receive a link to create a new password via e-mail.
					</Typography>
				</Stack>

				<Stack spacing={2} sx={{ marginTop: '30px' }}>
					<Button variant="contained" color="secondary" fullWidth type="submit" disabled={!isValid}>
						Confirm
					</Button>
					<Button
						variant="contained"
						fullWidth
						type="button"
						onClick={(e) => {
							e.preventDefault();
							navigateTo('signInTMPro');
						}}
					>
						Back
					</Button>
				</Stack>
			</Box>
		</Box>
	);
};

export default TMProForgotPassword;
