'use client';

import OmegaCheckbox from '@/components/OmegaCheckbox';
import OmegaTextField from '@/components/OmegaTextfield';
import { useActiveOmegaMutation } from '@/Redux/rtk-query/endpoints/setup/setup';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { Box, Button, Grid, Link, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface SignInTMProProps {
	navigateTo: (component: string) => void;
	setInitialCompanyId: (companyId: string) => void;
}

interface FormData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	companyName: string;
	address?: string;
	phoneNumber?: string;
	privacyConsent: boolean;
}

const SignInTMPro: React.FC<SignInTMProProps> = ({ navigateTo, setInitialCompanyId }) => {
	const [activeOmega, { isLoading }] = useActiveOmegaMutation();
	const [responseErrorMessage, setResponseErrorMessage] = useState<string>('');

	const {
		control,
		handleSubmit,
		setError,
		formState: { isValid, errors }
	} = useForm<FormData>({
		mode: 'onSubmit',
		defaultValues: {
			companyName: '',
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			password: '',
			address: '',
			privacyConsent: false
		}
	});

	const onSubmit = async (data: FormData) => {
		setResponseErrorMessage('');
		await activeOmega({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phoneNumber: data.phoneNumber,
			password: data.password,
			companyName: data.companyName,
			address: data.address
		})
			.unwrap()
			.then((result) => {
				setInitialCompanyId(result?.data);
				navigateTo('allSet');
			})
			.catch((error) => {
				if (error.status === 401) {
					handle401Error();
				} else {
					setResponseErrorMessage(error.data.message || 'Internal Server Error');
				}
			});
	};

	const handle401Error = () => {
		setError('email', { type: 'manual', message: 'Incorrect email' });
		setError('password', { type: 'manual', message: 'Incorrect password' });
	};

	return (
		<Box>
			<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
				<Stack spacing={2}>
					<Typography sx={{ fontWeight: 'bold' }} variant="h1">
						Set up OMEGA
					</Typography>
					<Typography sx={{ fontWeight: 'bold' }} variant="h3">
						Existing TrolMaster User
					</Typography>
					<Grid container spacing={3}>
						<Grid size={6}>
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
						</Grid>

						<Grid size={6}>
							<Typography variant="h5" sx={{ marginBottom: '5px' }}>
								Password *
							</Typography>
							<Controller name="password" control={control} rules={{ required: 'Password is required' }} render={({ field }) => <OmegaTextField {...field} size="small" type="password" fullWidth startIcon={<LockOutlineIcon />} placeholder="Password" error={!!errors.password} helperText={errors.password?.message} />} />
							<Box sx={{ textAlign: 'right', marginTop: '20px' }}>
								<Link
									component="button"
									type="button"
									variant="h4"
									onClick={(e) => {
										e.preventDefault();
										navigateTo('forgotTMPro');
									}}
								>
									Forgot Password?
								</Link>
							</Box>
						</Grid>
					</Grid>
				</Stack>
				<Stack spacing={2}>
					<Typography sx={{ fontWeight: 'bold' }} variant="h3">
						Set up your OMEGA
					</Typography>

					<Grid container spacing={3}>
						<Grid size={6}>
							<Typography variant="h5" sx={{ marginBottom: '5px' }}>
								First Name *
							</Typography>
							<Controller name="firstName" control={control} rules={{ required: 'First Name is required' }} render={({ field }) => <OmegaTextField {...field} startIcon={<PersonOutlineIcon />} size="small" fullWidth placeholder="First Name" error={!!errors.firstName} helperText={errors.firstName?.message} />} />
						</Grid>

						<Grid size={6}>
							<Typography variant="h5" sx={{ marginBottom: '5px' }}>
								Last Name *
							</Typography>
							<Controller name="lastName" control={control} rules={{ required: 'Last Name is required' }} render={({ field }) => <OmegaTextField {...field} startIcon={<PersonOutlineIcon />} size="small" fullWidth placeholder="Last Name" error={!!errors.lastName} helperText={errors.lastName?.message} />} />
						</Grid>

						<Grid size={6}>
							<Typography variant="h5" sx={{ marginBottom: '5px' }}>
								Company Name *
							</Typography>
							<Controller name="companyName" control={control} rules={{ required: 'Company Name is required' }} render={({ field }) => <OmegaTextField {...field} startIcon={<BusinessIcon />} size="small" fullWidth placeholder="Company Name" error={!!errors.companyName} helperText={errors.companyName?.message} />} />
						</Grid>

						<Grid size={6}>
							<Typography variant="h5" sx={{ marginBottom: '5px' }}>
								Phone Number
							</Typography>
							<Controller name="phoneNumber" control={control} render={({ field }) => <OmegaTextField {...field} startIcon={<PhoneOutlinedIcon />} size="small" fullWidth placeholder="Phone Number" />} />
						</Grid>
						<Grid size={12}>
							<Typography variant="h5" sx={{ marginBottom: '5px' }}>
								Address
							</Typography>
							<Controller name="address" control={control} render={({ field }) => <OmegaTextField {...field} startIcon={<LocationOnOutlinedIcon />} size="small" fullWidth placeholder="Address" />} />
						</Grid>
					</Grid>

					{responseErrorMessage && (
						<Typography color="error" sx={{ marginTop: '10px', fontSize: '0.9rem' }}>
							{responseErrorMessage}
						</Typography>
					)}
				</Stack>
				<Box sx={{ display: 'flex', alignItems: 'flex-start', marginTop: '30px' }}>
					<Controller name="privacyConsent" control={control} rules={{ required: 'You must accept the privacy policy' }} render={({ field }) => <OmegaCheckbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} />
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
							We're committed to your privacy. TrolMaster uses the information you provide to us to contact you about our relevant content, products, and services. You may unsubscribe from these communications at any time. For more information, check out our{' '}
							<Link href="#" underline="always" color="#26B2A7">
								Privacy Policy
							</Link>
							.
						</Typography>
						{errors.privacyConsent && (
							<Typography color="error" variant="h4" sx={{ marginTop: '4px' }}>
								*{errors.privacyConsent.message}
							</Typography>
						)}
					</Box>
				</Box>
				<Stack spacing={2} sx={{ marginTop: '30px' }}>
					<Button variant="contained" color="secondary" fullWidth type="submit" loading={isLoading} disabled={!isValid || isLoading}>
						Activate
					</Button>
					<Button
						variant="contained"
						fullWidth
						type="button"
						onClick={(e) => {
							e.preventDefault();
							navigateTo('signUpUser');
						}}
					>
						Back
					</Button>
				</Stack>
			</Box>
		</Box>
	);
};

export default SignInTMPro;
