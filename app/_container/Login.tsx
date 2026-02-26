'use client';

import OmegaCheckbox from '@/components/OmegaCheckbox';
import OmegaTextField from '@/components/OmegaTextfield';
import { useGetUnitPreferenceMutation, useLoginMutation } from '@/Redux/rtk-query/endpoints/auth/auth';
import BusinessIcon from '@mui/icons-material/Business';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, Button, Grid, Link, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface LoginProps {
	navigateTo: (component: string) => void;
	initialCompanyId?: string;
}

interface LoginFormData {
	companyId: string;
	username: string;
	password: string;
	rememberMe: boolean;
}

const Login: React.FC<LoginProps> = ({ navigateTo, initialCompanyId }) => {
	const [login, { isLoading: isLoggingIn }] = useLoginMutation();
	const [getUnitPreference] = useGetUnitPreferenceMutation();
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const {
		control,
		handleSubmit,
		formState: { isValid, errors }
	} = useForm<LoginFormData>({
		mode: 'onSubmit',
		defaultValues: {
			companyId: initialCompanyId ?? '',
			username: '',
			password: '',
			rememberMe: false
		}
	});

	const onSubmit = async (data: LoginFormData) => {
		setError(null);
		try {
			await login({
				realm: data.companyId,
				username: data.username,
				password: data.password
			})
				.unwrap()
				.then(async (res) => {
					window.sessionStorage.setItem('access_token', res.data.access_token);
					window.sessionStorage.setItem('refresh_token', res.data.refresh_token);
					window.sessionStorage.setItem('realm', data.companyId);

					try {
						await getUnitPreference(data.companyId).unwrap();
					} catch (err) {
						console.error('Failed to fetch unit preferences:', err);
					}

					router.push('adminPanel/facility');
				});
		} catch (err) {
			setError('Username or password incorrect');
			console.error('Login failed:', err);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && isValid && !isLoggingIn) {
			handleSubmit(onSubmit)();
		}
	};

	return (
		<Box onKeyDown={handleKeyDown}>
			<Box sx={{ marginBottom: '30px' }}>
				<Typography sx={{ fontWeight: 'bold' }} variant="h1">
					Welcome to
				</Typography>
				<Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }} variant="h1">
					omega
				</Typography>
			</Box>
			<Box component="form" onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={5}>
					<Box>
						<Typography variant="h5" sx={{ marginBottom: '5px' }}>
							Company ID *
						</Typography>
						<Controller name="companyId" control={control} rules={{ required: 'Company ID is required' }} render={({ field }) => <OmegaTextField {...field} startIcon={<BusinessIcon />} size="small" fullWidth placeholder="Company ID" error={!!errors.companyId} helperText={errors.companyId?.message} />} />
					</Box>
					<Box>
						<Typography variant="h5" sx={{ marginBottom: '5px' }}>
							Email *
						</Typography>
						<Controller
							name="username"
							control={control}
							rules={{
								required: 'Email is required',
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: 'Invalid email address'
								}
							}}
							render={({ field }) => <OmegaTextField {...field} startIcon={<MailOutlineIcon />} size="small" fullWidth placeholder="Email" error={!!errors.username} helperText={errors.username?.message} />}
						/>
					</Box>
					<Box>
						<Typography variant="h5" sx={{ marginBottom: '5px' }}>
							Password *
						</Typography>
						<Controller name="password" control={control} rules={{ required: 'Password is required' }} render={({ field }) => <OmegaTextField {...field} size="small" type="password" fullWidth startIcon={<LockOutlineIcon />} placeholder="Password" error={!!errors.password} helperText={errors.password?.message} />} />
					</Box>
				</Stack>

				<Box sx={{ margin: '20px 0px' }}>
					<Controller name="rememberMe" control={control} render={({ field }) => <OmegaCheckbox label="Stay logged in" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} />
				</Box>

				{error && (
					<Typography color="error" sx={{ marginBottom: '10px', fontSize: '0.9rem' }}>
						{error}
					</Typography>
				)}

				<Box>
					<Button variant="contained" color="secondary" type="submit" fullWidth loading={isLoggingIn} disabled={!isValid || isLoggingIn}>
						Confirm
					</Button>
				</Box>

				<Link
					component="button"
					type="button"
					variant="h4"
					onClick={() => {
						navigateTo('forgot');
					}}
					sx={{ margin: '30px 0px' }}
				>
					Forgot Company ID / Password?
				</Link>

				<hr />

				<Box>
					<Typography variant="h2" sx={{ fontWeight: 'bold', marginTop: '30px' }}>
						New User?
					</Typography>
					<Grid container spacing={2} sx={{ alignItems: 'center' }}>
						<Grid size={6}>
							<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
								{"Don't have an account?"}
							</Typography>
						</Grid>
						<Grid size={6}>
							<Button
								variant="contained"
								color="secondary"
								fullWidth
								size="large"
								type="button"
								loading={false}
								disabled={isLoggingIn}
								onClick={(e) => {
									e.preventDefault();
									navigateTo('signUpUser');
								}}
							>
								Sign Up Here
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
};

export default Login;
