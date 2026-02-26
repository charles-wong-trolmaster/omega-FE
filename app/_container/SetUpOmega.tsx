'use client';

import OmegaTextField from '@/components/OmegaTextfield';
import { useCreateRealmMutation } from '@/Redux/rtk-query/endpoints/realm/realm';
import BusinessIcon from '@mui/icons-material/Business';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormHelperText, IconButton, Link, Popover, Stack, Typography } from '@mui/material';
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
	realm: string;
	privacyConsent: boolean;
}

interface PasswordRequirement {
	label: string;
	test: (password: string) => boolean;
}

interface SetUpOmegaProps {
	navigateTo: (component: string) => void;
}

const helpFields: {
	name: keyof Pick<FormData, 'realm' | 'firstName' | 'lastName' | 'email' | 'phoneNumber'>;
	label: string;
	type?: string;
}[] = [
	{ name: 'realm', label: 'Realm' },
	{ name: 'firstName', label: 'First Name' },
	{ name: 'lastName', label: 'Last Name' },
	{ name: 'email', label: 'Email' },
	{ name: 'phoneNumber', label: 'Phone Number', type: 'tel' }
];

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

const SetUpOmega: React.FC<SetUpOmegaProps> = ({ navigateTo }) => {
	const [createRealm, { isLoading }] = useCreateRealmMutation();
	const [helpAnchorEl, setHelpAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [requirementsAnchorEl, setRequirementsAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [errorModalOpen, setErrorModalOpen] = useState(false);

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
			confirmPassword: 'P@ssw0rd!',
			realm: '',
			privacyConsent: true
		}
	});

	const passwordValue = watch('password', '');

	const onSubmit = async (data: FormData) => {
		const apiPayload = {
			realm: data.realm,
			displayName: data.companyName,
			realmUserCreateReq: {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phoneNumber: data.phoneNumber,
				password: data.password
			}
		};

		await createRealm(apiPayload)
			.unwrap()
			.then(() => {
				navigateTo('allSet');
			});
	};

	return (
		<Box>
			<Box sx={{ marginBottom: '30px' }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Typography sx={{ fontWeight: 'bold' }} variant="h1">
						Set up OMEGA
					</Typography>
					<IconButton size="small" onClick={(e) => setHelpAnchorEl(e.currentTarget)} sx={{ color: 'warning.main' }}>
						<SearchIcon />
					</IconButton>
				</Box>
			</Box>

			<Popover open={Boolean(helpAnchorEl)} anchorEl={helpAnchorEl} onClose={() => setHelpAnchorEl(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
				<Box sx={{ backgroundColor: 'primary.main', p: 2, borderRadius: 1, width: 350 }}>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
						<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
							From TM+ pro information
						</Typography>
						<IconButton size="small" onClick={() => setHelpAnchorEl(null)} sx={{ color: 'warning.main' }}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</Box>
					<Stack spacing={1.5}>
						{helpFields.map(({ name, label, type }) => (
							<Box key={name}>
								<Typography variant="body2" sx={{ mb: 0.5 }}>
									{label}:
								</Typography>
								<Controller name={name} control={control} render={({ field }) => <OmegaTextField {...field} type={type} size="small" fullWidth placeholder={label} />} />
							</Box>
						))}
					</Stack>
				</Box>
			</Popover>

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

			<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
				<Stack spacing={5}>
					<Box>
						<Typography variant="h5" sx={{ marginBottom: '5px' }}>
							Company Name *
						</Typography>
						<Controller name="companyName" control={control} rules={{ required: 'Company name is required' }} render={({ field }) => <OmegaTextField {...field} startIcon={<BusinessIcon />} size="small" fullWidth placeholder="Company Name" error={!!errors.companyName} helperText={errors.companyName?.message} />} />
					</Box>

					<Box>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginBottom: '5px' }}>
							<Typography variant="h5">Password *</Typography>
							<IconButton size="small" onClick={(e) => setRequirementsAnchorEl(e.currentTarget)} sx={{ color: 'warning.main' }}>
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
							render={({ field }) => <OmegaTextField {...field} type="password" startIcon={<LockOutlineIcon />} size="small" fullWidth placeholder="Confirm Password" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />}
						/>
					</Box>
				</Stack>

				<Box sx={{ margin: '20px 0px' }}>
					<Controller
						name="privacyConsent"
						control={control}
						rules={{ required: 'You must accept the privacy policy' }}
						render={({ field: { value, onChange, ...field } }) => (
							<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
								<Checkbox {...field} checked={value} onChange={(e) => onChange(e.target.checked)} color="secondary" sx={{ pt: 0 }} />
								<Box>
									<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
										We're committed to your privacy. TrolMaster uses the information you provide to us to contact you about our relevant content, products, and services. You may unsubscribe from these communications at any time. For more information, check out our{' '}
										<Link href="#" underline="always" color="#26B2A7">
											Privacy Policy
										</Link>
										.
									</Typography>
									{errors.privacyConsent && <FormHelperText error>*{errors.privacyConsent.message}</FormHelperText>}
								</Box>
							</Box>
						)}
					/>
				</Box>

				<Box>
					<Button variant="contained" color="secondary" type="submit" fullWidth size="large" loading={isLoading} disabled={!isValid || isLoading}>
						Activate
					</Button>
				</Box>

				<Box sx={{ margin: '20px 0px' }}>
					<Button variant="contained" fullWidth size="large" type="button" loading={false} disabled={isLoading} onClick={() => navigateTo('login')}>
						Back
					</Button>
				</Box>
			</Box>

			{/* Test 500 Error */}
			<Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px 0px' }}>
				<Button variant="contained" color="primary" size="large" loading={false} onClick={() => setErrorModalOpen(true)} sx={{ width: '33%' }}>
					Test 500 error
				</Button>
			</Box>

			{/* 500 Error Dialog */}
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
		</Box>
	);
};

export default SetUpOmega;
