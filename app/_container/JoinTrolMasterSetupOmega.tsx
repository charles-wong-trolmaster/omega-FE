'use client';

import OmegaCheckbox from '@/components/OmegaCheckbox';
import OmegaTextField from '@/components/OmegaTextfield';
import { useGetValidCodeMutation } from '@/Redux/rtk-query/endpoints/setup/setup';
import BusinessIcon from '@mui/icons-material/Business';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, FormHelperText, Grid, IconButton, Link, Popover, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface FormData {
	companyName: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	address: string;
	realm: string;
	privacyConsent: boolean;
	marketingConsent: boolean;
}

interface PasswordRequirement {
	label: string;
	test: (password: string) => boolean;
}

interface JoinTrolMasterSetupOmegaProps {
	navigateTo: (component: string) => void;
	setRegisterData: (data: any) => void;
}

const requirements: PasswordRequirement[] = [
	{
		label: 'Contain 8 to 30 characters',
		test: (pwd) => pwd.length >= 8 && pwd.length <= 30
	},
	{
		label: 'Contain both lower and uppercase letters',
		test: (pwd) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd)
	},
	{
		label: 'Contain 1 number',
		test: (pwd) => /\d/.test(pwd)
	},
	{
		label: "Contain 1 special character '!@#$%^&*()+' ",
		test: (pwd) => /[!@#$%^&*()+]/.test(pwd)
	}
];

const JoinTrolMasterSetupOmega: React.FC<JoinTrolMasterSetupOmegaProps> = ({ navigateTo, setRegisterData }) => {
	const [getValidCode, { isLoading }] = useGetValidCodeMutation();
	const [requirementsAnchorEl, setRequirementsAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		watch,
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
			confirmPassword: '',
			address: '',
			realm: '',
			privacyConsent: false,
			marketingConsent: false
		}
	});

	const passwordValue = watch('password', '');

	const onSubmit = async (data: FormData) => {
		setError(null);
		const apiPayload = {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phoneNumber: data.phoneNumber,
			password: data.password,
			companyName: data.companyName,
			address: data.address
		};

		try {
			await getValidCode({ ...apiPayload })
				.unwrap()
				.then(() => {
					setRegisterData(apiPayload);
					navigateTo('setUpVerify');
				});
		} catch (err: any) {
			if (err.status !== 401) {
				setErrorModalOpen(true);
				return;
			}
			setError('Something went wrong. Please try again.');
		}
	};

	return (
		<Box>
			<Box sx={{ marginBottom: '30px' }}>
				<Typography sx={{ fontWeight: 'bold' }} variant="h1">
					Join TrolMaster & Set up OMEGA
				</Typography>
			</Box>

			<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
				<Stack spacing={2}>
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
					<Grid container spacing={2}>
						<Grid size={6}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginBottom: '5px' }}>
								<Typography variant="h5">Password *</Typography>
								<IconButton size="small" onClick={(e) => setRequirementsAnchorEl(e.currentTarget)} sx={{ color: 'warning.main', padding: '0px' }}>
									<InfoOutlinedIcon fontSize="small" />
								</IconButton>
							</Box>
							<Controller
								name="password"
								control={control}
								rules={{
									required: 'Password is required',
									validate: (value) => requirements.every((req) => req.test(value)) || 'Password does not meet all requirements'
								}}
								render={({ field }) => <OmegaTextField {...field} type="password" startIcon={<LockOutlineIcon />} size="small" fullWidth placeholder="Password" error={!!errors.password} helperText={errors.password?.message} />}
							/>
						</Grid>
						<Grid size={6}>
							<Typography variant="h5" sx={{ marginBottom: '5px' }}>
								Confirm Password *
							</Typography>
							<Controller
								name="confirmPassword"
								control={control}
								rules={{
									required: 'Confirm Password is required',
									validate: (v) => v === passwordValue || 'Passwords do not match'
								}}
								render={({ field }) => <OmegaTextField {...field} type="password" startIcon={<LockOutlineIcon />} size="small" fullWidth placeholder="Confirm Password" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />}
							/>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid size={6}>
							<Typography variant="h5" sx={{ marginBottom: '5px' }}>
								First Name *
							</Typography>
							<Controller name="firstName" control={control} rules={{ required: 'First name is required' }} render={({ field }) => <OmegaTextField {...field} startIcon={<PersonOutlineIcon />} size="small" fullWidth placeholder="First Name" error={!!errors.firstName} helperText={errors.firstName?.message} />} />
						</Grid>
						<Grid size={6}>
							<Typography variant="h5" sx={{ marginBottom: '5px' }}>
								Last Name *
							</Typography>
							<Controller name="lastName" control={control} rules={{ required: 'Last name is required' }} render={({ field }) => <OmegaTextField {...field} startIcon={<PersonOutlineIcon />} size="small" fullWidth placeholder="Last Name" error={!!errors.lastName} helperText={errors.lastName?.message} />} />
						</Grid>
					</Grid>

					<Grid container spacing={2}>
						<Grid size={6}>
							<Typography variant="h5" sx={{ marginBottom: '5px' }}>
								Company Name *
							</Typography>
							<Controller name="companyName" control={control} rules={{ required: 'Company name is required' }} render={({ field }) => <OmegaTextField {...field} startIcon={<BusinessIcon />} size="small" fullWidth placeholder="Company Name" error={!!errors.companyName} helperText={errors.companyName?.message} />} />
						</Grid>
						<Grid size={6}>
							<Typography variant="h5" sx={{ marginBottom: '5px' }}>
								Phone Number
							</Typography>
							<Controller name="phoneNumber" control={control} render={({ field }) => <OmegaTextField {...field} type="tel" startIcon={<PhoneOutlinedIcon />} size="small" fullWidth placeholder="Phone Number" />} />
						</Grid>
					</Grid>

					<Box>
						<Typography variant="h5" sx={{ marginBottom: '5px' }}>
							Address
						</Typography>
						<Controller name="address" control={control} render={({ field }) => <OmegaTextField {...field} startIcon={<LocationOnOutlinedIcon />} size="small" fullWidth placeholder="Address" />} />
					</Box>
				</Stack>

				<Box sx={{ margin: '30px 0px 20px 0px', display: 'flex', alignItems: 'flex-start' }}>
					<Controller name="privacyConsent" control={control} rules={{ required: 'You must accept the privacy policy' }} render={({ field }) => <OmegaCheckbox sx={{ paddingTop: '0px' }} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} />
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
							As a new user, a <strong>TM+ Pro</strong> account has been created for you and the Omega service has been activated simultaneously{' '}
							<Link href="#" underline="always" color="#26B2A7">
								Privacy Policy
							</Link>
							.
						</Typography>
						{errors.privacyConsent && (
							<Typography color="error" variant="h4" sx={{ marginTop: '4px' }}>
								{errors.privacyConsent && <FormHelperText error>*{errors.privacyConsent.message}</FormHelperText>}
							</Typography>
						)}
					</Box>
				</Box>

				<Box sx={{ margin: '20px 0px 30px 0px', display: 'flex', alignItems: 'flex-start' }}>
					<Controller name="marketingConsent" control={control} rules={{ required: 'You must accept the privacy policy' }} render={({ field }) => <OmegaCheckbox sx={{ paddingTop: '0px' }} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} />
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
								{errors.marketingConsent && <FormHelperText error>*{errors.marketingConsent.message}</FormHelperText>}
							</Typography>
						)}
					</Box>
				</Box>

				{error && (
					<Typography color="error" sx={{ marginBottom: '10px', fontSize: '0.9rem' }}>
						{error}
					</Typography>
				)}

				<Box>
					<Button variant="contained" color="secondary" type="submit" fullWidth size="large" loading={isLoading} disabled={!isValid || isLoading}>
						Get Verification Code
					</Button>
				</Box>

				<Box sx={{ margin: '20px 0px' }}>
					<Button variant="contained" fullWidth size="large" type="button" loading={false} disabled={isLoading} onClick={() => navigateTo('login')}>
						Back to Login
					</Button>
				</Box>
			</Box>

			<Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)} PaperProps={{ sx: { borderRadius: 2 } }}>
				<DialogContent>
					<Typography variant="h2" sx={{ mb: 2 }}>
						500 error
					</Typography>
					<Typography>/keyCode error</Typography>
				</DialogContent>
				<DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
					<Button variant="outlined" onClick={() => setErrorModalOpen(false)}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			{/* Password Requirements Popover */}
			<Popover open={Boolean(requirementsAnchorEl)} anchorEl={requirementsAnchorEl} onClose={() => setRequirementsAnchorEl(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
				<Box sx={{ backgroundColor: 'primary.main', p: 2, borderRadius: 1, width: 350 }}>
					<Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
						Password must:
					</Typography>
					<Stack spacing={1}>
						{requirements.map((requirement, index) => (
							<Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								{requirement.test(passwordValue) ? <CheckCircleOutlineIcon color="secondary" fontSize="small" /> : <CancelOutlinedIcon color="error" fontSize="small" />}
								<Typography variant="body2">{requirement.label}</Typography>
							</Box>
						))}
					</Stack>
				</Box>
			</Popover>
		</Box>
	);
};

export default JoinTrolMasterSetupOmega;
