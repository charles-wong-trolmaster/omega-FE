'use client';

import OmegaTextField from '@/components/OmegaTextfield';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

interface PasswordRequirement {
	label: string;
	test: (password: string) => boolean;
}

interface SignUpEmailProps {
	navigateTo: (component: string) => void;
}

interface FormData {
	email: string;
	password: string;
	confirmPassword: string;
}

const SignUpEmail: React.FC<SignUpEmailProps> = ({ navigateTo }) => {
	const {
		control,
		handleSubmit,
		watch,
		formState: { isValid, errors }
	} = useForm<FormData>({
		mode: 'onSubmit',
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: ''
		}
	});

	const passwordValue = watch('password', '');

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

	const onSubmit = () => {
		navigateTo('setUpVerify');
	};

	return (
		<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
			<Stack spacing={4}>
				<Typography sx={{ fontWeight: 'bold' }} variant="h1">
					Sign Up
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

				<Box>
					<Typography variant="h5" sx={{ marginBottom: '5px' }}>
						Password *
					</Typography>
					<Controller name="password" control={control} rules={{ required: 'Password is required' }} render={({ field }) => <OmegaTextField {...field} size="small" type="password" fullWidth startIcon={<LockOutlineIcon />} placeholder="Password" error={!!errors.password} helperText={errors.password?.message} />} />
				</Box>

				<Box>
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
						render={({ field }) => <OmegaTextField {...field} size="small" type="password" fullWidth startIcon={<LockOutlineIcon />} placeholder="Confirm Password" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />}
					/>
				</Box>

				<Box sx={{ backgroundColor: 'primary.main', padding: 2, borderRadius: 1 }}>
					<Typography variant="h5" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
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

				<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
					As a new user, a <strong>TM+ Pro</strong> account has been created for you and the Omega service has been activated simultaneously.
				</Typography>
			</Stack>

			<Stack spacing={2} sx={{ marginTop: '30px' }}>
				<Button variant="contained" color="secondary" fullWidth type="submit" disabled={!isValid}>
					Sign Up
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
	);
};

export default SignUpEmail;
