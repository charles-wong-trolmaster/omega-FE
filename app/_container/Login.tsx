'use client';

import { useGetUnitPreferenceMutation, useLoginMutation } from '@/Redux/rtk-query/endpoints/auth/auth';
import BusinessIcon from '@mui/icons-material/Business';
import { FormControl, FormLabel, InputAdornment, TextField, Typography } from '@mui/material';

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
	const [showPassword, setShowPassword] = useState(false);
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
		<div className="uk-width-large" onKeyDown={handleKeyDown}>
			{/* <div variant="h3">Welcome to OMEGA</div> */}
			<Typography variant="h3">Welcome to OMEGA</Typography>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="uk-margin">
					<h5 className="uk-margin-xsmall-bottom uk-text-warning">Company ID *</h5>
					<div className="uk-inline uk-width-1-1">
						<span className="uk-form-icon" uk-icon="icon: user"></span>
						<input className="uk-input uk-border-pill" placeholder="Company ID" type="text" {...register('companyId')} disabled={isLoggingIn} />
					</div>

					<FormControl fullWidth>
						<FormLabel
							sx={{
								color: 'white',
								mb: 1,
								fontSize: '0.9rem'
							}}
						>
							Company ID *
						</FormLabel>
						<TextField
							placeholder="Company ID"
							variant="outlined"
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<BusinessIcon sx={{ color: '#9e9e9e' }} />
										</InputAdornment>
									)
								}
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: '50px',
									backgroundColor: '#e8e8e8',
									'& fieldset': {
										border: 'none'
									},
									'&:hover fieldset': {
										border: 'none'
									},
									'&.Mui-focused fieldset': {
										border: 'none'
									}
								},
								'& .MuiInputBase-input': {
									color: '#666'
								},
								'& .MuiInputBase-input::placeholder': {
									color: '#9e9e9e',
									opacity: 1
								}
							}}
						/>
					</FormControl>
					<div>test123</div>
				</div>

				<div className="uk-margin">
					<h5 className="uk-margin-xsmall-bottom  uk-text-warning">Email *</h5>
					<div className="uk-inline uk-width-1-1">
						<span className="uk-form-icon" uk-icon="icon: mail"></span>
						<input className="uk-input uk-border-pill" placeholder="E-mail Address / Username" type="text" {...register('username', { required: true })} disabled={isLoggingIn} autoComplete="username" />
					</div>
				</div>

				<div className="uk-margin">
					<h5 className="uk-margin-xsmall-bottom uk-text-warning">Password *</h5>
					<div className="uk-inline uk-width-1-1">
						<span className="uk-form-icon" uk-icon="icon: lock"></span>
						<a
							className="uk-form-icon uk-form-icon-flip"
							uk-icon={`icon: ${showPassword ? 'eye-slash' : 'eye'}`}
							onClick={() => {
								if (!isLoggingIn) setShowPassword(!showPassword);
							}}
							style={{ cursor: isLoggingIn ? 'not-allowed' : 'pointer' }}
						></a>
						<input
							className={`uk-input uk-border-pill ${error ? 'uk-form-danger' : ''}`}
							placeholder="Password"
							type={showPassword ? 'text' : 'password'}
							{...register('password', {
								required: true,
								onChange: () => setError(null)
							})}
							disabled={isLoggingIn}
							autoComplete="current-password"
						/>
					</div>
					{error && <div className="uk-text-danger uk-text-small uk-margin-small-top">{error}</div>}
				</div>

				<div className="uk-margin-small">
					<label className="uk-text-small uk-text-warning uk-text-bold uk-flex uk-flex-middle">
						<input className="uk-checkbox uk-border-pill uk-margin-remove " type="checkbox" {...register('rememberMe')} disabled={isLoggingIn} />
						<span className="uk-text-warning uk-margin-small-left">Stay logged in</span>
					</label>
				</div>

				<div className="uk-margin">
					<button className="uk-button uk-button-secondary uk-button-large uk-width-1-1 uk-border-pill" type="submit" disabled={!isValid || isLoggingIn}>
						{isLoggingIn ? <div uk-spinner="ratio: 0.6"></div> : 'Log In'}
					</button>
				</div>

				<div className="uk-text-left uk-margin-small">
					<a
						href="#"
						className="uk-h4 uk-text-bold uk-text-warning"
						onClick={(e) => {
							e.preventDefault();
							navigateTo('forgot');
						}}
					>
						Forgot Company ID / Password?
					</a>
				</div>

				<hr className="uk-margin uk-text-muted" />

				<div>
					<p className="uk-h2 uk-text-bolder uk-text-warning">New User?</p>
					<div>
						<span className="uk-h4 uk-text-bold uk-text-warning uk-margin-small-right">Don't have an account?</span>
						<button
							className="uk-button uk-button-secondary uk-button-large uk-border-pill"
							type="button"
							onClick={(e) => {
								e.preventDefault();
								navigateTo('signUpUser');
							}}
							disabled={isLoggingIn}
						>
							Sign Up Here
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Login;
