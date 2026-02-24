'use client';

import OmegaButton from '@/components/OmegaButton';
import OmegaCheckbox from '@/components/OmegaCheckbox';
import OmegaPasswordField from '@/components/OmegaPasswordField';
import OmegaTextField from '@/components/OmegaTextfield';
import { useGetUnitPreferenceMutation, useLoginMutation } from '@/Redux/rtk-query/endpoints/auth/auth';
import BusinessIcon from '@mui/icons-material/Business';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, FormControl, Grid, Link, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
	const [checked, setChecked] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	function handleClick() {
		setLoading(true);
	}

	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { isValid }
	} = useForm<LoginFormData>({
		mode: 'onSubmit',
		defaultValues: {
			companyId: 'cus_00000',
			username: 'charles@trolmaster.com',
			password: 'P@ssw0rd!',
			rememberMe: false
		}
	});

	const onSubmit = async (data: LoginFormData) => {
		setError(null);

		const loginData = {
			username: data.username,
			password: data.password
		};

		try {
			await login({ realm: data.companyId, ...loginData })
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
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && isValid && !isLoggingIn) {
			handleSubmit(onSubmit)();
		}
	};

	return (
		<Box sx={{ paddingTop: '80px', width: '100%' }} onKeyDown={handleKeyDown}>
			{/* <Box variant="h3">Welcome to OMEGA</Box> */}
			<img src="/img/trolmasterLogo.svg" alt="" />
			<Box sx={{ margin: '30px 0px ' }}>
				<Typography sx={{ fontWeight: 'bold' }} variant="h1">
					Welcome to
				</Typography>
				<Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }} variant="h1">
					omega
				</Typography>
			</Box>
			<FormControl onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
				<Stack spacing={5}>
					<Box>
						<Typography variant="h5" sx={{ marginBottom: '5px' }}>
							Company ID *
						</Typography>
						<OmegaTextField value={''} startIcon={<BusinessIcon />} size="small" fullWidth placeholder="Company ID" />
					</Box>
					<Box>
						<Typography variant="h5" sx={{ marginBottom: '5px' }}>
							Email *
						</Typography>
						<OmegaTextField value={''} startIcon={<MailOutlineIcon />} size="small" fullWidth placeholder="Email" />
					</Box>
					<Box>
						<Typography variant="h5" sx={{ marginBottom: '5px' }}>
							Password *
						</Typography>
						<OmegaPasswordField size="small" fullWidth startIcon={<LockOutlineIcon />} placeholder="Password" />
					</Box>
				</Stack>

				<Box sx={{ margin: '20px 0px' }}>
					<OmegaCheckbox label="Stay logged in" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
				</Box>

				<Box>
					<OmegaButton omegaVariant="confirm" fullWidth size="small" loading={loading} loadingPosition="start" onClick={handleClick}>
						Confirm
					</OmegaButton>
					{/* <OmegaButton omegaVariant="back" fullWidth onClick={handleClick}>
						Back
					</OmegaButton> */}
				</Box>

				<Link
					component="button"
					variant="body2"
					onClick={(e) => {
						e.preventDefault();
						navigateTo('forgot');
					}}
					sx={{ fontSize: '16px', textAlign: 'left', margin: '30px 0px ' }}
				>
					Forgot Company ID / Password?
				</Link>

				<hr />

				<Box>
					<Typography variant="h2" sx={{ fontWeight: 'bold', marginTop: '30px' }}>
						New User?
					</Typography>
					<Box>
						<Grid container spacing={2} sx={{ alignItems: 'center' }}>
							<Grid size={6}>
								<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
									Don't have an account?
								</Typography>
							</Grid>
							<Grid size={6}>
								<OmegaButton
									omegaVariant="confirm"
									fullWidth
									size="small"
									loading={false}
									loadingPosition="start"
									onClick={(e) => {
										e.preventDefault();
										navigateTo('signUpUser');
									}}
									disabled={isLoggingIn}
								>
									Sign Up Here
								</OmegaButton>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</FormControl>
		</Box>
	);
};

export default Login;
