import { useResendVerificationCodeMutation, useVerifyOTPMutation } from '@/Redux/rtk-query/endpoints/setup/setup';
import { Box, Button, Link, OutlinedInput, Typography } from '@mui/material';
import { ClipboardEvent, useEffect, useRef, useState } from 'react';

interface SignUpVerifyProps {
	navigateTo: (component: string) => void;
	registerData: any;
	setInitialCompanyId: (companyId: string) => void;
}

const SignUpVerify: React.FC<SignUpVerifyProps> = ({ navigateTo, registerData, setInitialCompanyId }) => {
	const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
	const [resendOTP] = useResendVerificationCodeMutation();
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const redirectTimeOut = useRef<any>('');

	const [timeLeft, setTimeLeft] = useState(900);
	const [resendCooldown, setResendCooldown] = useState(0);
	const [isWrongNumber, setIsWrongNumber] = useState<boolean>(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const resendIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		redirectTimeOut.current = setTimeout(() => {
			navigateTo('signInTMPro');
		}, 1000 * 60 * 15);

		intervalRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					if (intervalRef.current) clearInterval(intervalRef.current);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
			if (redirectTimeOut.current) clearTimeout(redirectTimeOut.current);
			if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
		};
	}, []);

	useEffect(() => {
		if (resendCooldown > 0) {
			resendIntervalRef.current = setInterval(() => {
				setResendCooldown((prev) => {
					if (prev <= 1) {
						if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
		return () => {
			if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
		};
	}, [resendCooldown]);

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const handleChange = (index: number, value: string) => {
		if (value && !/^\d$/.test(value)) {
			if (inputRefs.current[index]) {
				inputRefs.current[index]!.value = '';
			}
			return;
		}
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	// const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
	// 	if (e.key === 'Backspace') {
	// 		if (!e.currentTarget.value && index > 0) {
	// 			inputRefs.current[index - 1]?.focus();
	// 		}
	// 	} else if (/^\d$/.test(e.key) && e.currentTarget.value) {
	// 		e.currentTarget.value = '';
	// 	}
	// };

	const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').slice(0, 6);
		const digits = pastedData.replace(/\D/g, '').split('');

		digits.forEach((digit, index) => {
			if (inputRefs.current[index]) {
				inputRefs.current[index]!.value = digit;
			}
		});

		const nextIndex = Math.min(digits.length, 5);
		inputRefs.current[nextIndex]?.focus();
	};

	const handleResendCode = async (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		await resendOTP({ ...registerData })
			.unwrap()
			.then(() => {
				clearTimeout(redirectTimeOut.current);
				redirectTimeOut.current = setTimeout(() => {
					navigateTo('signInTMPro');
				}, 1000 * 60 * 15);

				const hasPassedOneMinute = timeLeft <= 900;
				if (!hasPassedOneMinute) {
					setResendCooldown(60);
					return;
				}
				if (resendCooldown > 0) return;

				setResendCooldown(60);
				setTimeLeft(900);

				if (intervalRef.current) clearInterval(intervalRef.current);
				intervalRef.current = setInterval(() => {
					setTimeLeft((prev) => {
						if (prev <= 1) {
							if (intervalRef.current) clearInterval(intervalRef.current);
							return 0;
						}
						return prev - 1;
					});
				}, 1000);
			});
	};

	const canResend = timeLeft <= 839 && resendCooldown === 0;

	return (
		<Box>
			<Typography variant="h1" sx={{ fontWeight: 'bold', marginBottom: '30px' }}>
				Verify Code
			</Typography>
			<Typography sx={{ fontWeight: 'bold' }}>Please enter the code we just sent to email</Typography>
			<Typography sx={{ fontWeight: 'bold' }}>{registerData?.email}</Typography>

			<Box sx={{ display: 'flex', gap: 1, margin: '20px 0px' }}>
				{Array.from({ length: 6 }).map((_, index) => (
					<OutlinedInput
						key={index}
						inputRef={(el) => {
							inputRefs.current[index] = el;
						}}
						inputProps={{
							maxLength: 1,
							style: { textAlign: 'center', fontWeight: 'bold', fontSize: '1.25rem', padding: '8px' }
						}}
						sx={{
							width: 48,
							height: 48,
							borderRadius: 1,
							backgroundColor: 'white',
							...(isWrongNumber && {
								'& .MuiOutlinedInput-notchedOutline': {
									borderColor: '#E92E32',
									borderWidth: 2
								}
							})
						}}
						onChange={(e) => {
							handleChange(index, e.target.value);
							setIsWrongNumber(false);
						}}
						// onKeyDown={(e) => handleKeyDown(index, e as KeyboardEvent<HTMLInputElement>)}
						onPaste={(e) => handlePaste(e as ClipboardEvent<HTMLInputElement>)}
						disabled={timeLeft === 0}
					/>
				))}
			</Box>

			<Typography sx={{ fontWeight: 'bold' }}>
				{timeLeft > 0 ? (
					<>Please enter your verification code within {formatTime(timeLeft)}.</>
				) : (
					<Typography component="span" color="error">
						Verification code expired!
					</Typography>
				)}
			</Typography>

			<Typography sx={{ fontWeight: 'bold', margin: '20px 0px' }}>
				Don't Receive OTP?{' '}
				{canResend ? (
					<Link href="#" underline="always" color="#26B2A7" onClick={handleResendCode}>
						Resend code
					</Link>
				) : (
					<>
						<Typography component="span" color="text.disabled" sx={{ cursor: 'not-allowed' }}>
							Resend code
						</Typography>
						{resendCooldown > 0 && (
							<Typography component="span" color="text.disabled">
								{' '}
								in {formatTime(resendCooldown)}
							</Typography>
						)}
						{timeLeft > 839 && resendCooldown === 0 && (
							<Typography component="span" color="text.disabled">
								{' '}
								in {formatTime(timeLeft - 840)}
							</Typography>
						)}
					</>
				)}
			</Typography>

			<Box sx={{ margin: '20px 0px' }}>
				<Button
					variant="contained"
					color="secondary"
					size="large"
					fullWidth
					loading={isLoading}
					disabled={timeLeft === 0 || isLoading}
					onClick={async (e) => {
						e.preventDefault();
						await verifyOTP({
							code: inputRefs.current.map((input) => input?.value).join(''),
							...registerData
						})
							.unwrap()
							.then((result) => {
								setInitialCompanyId(result?.data);
								navigateTo('allSet');
							});
					}}
				>
					Verify
				</Button>
			</Box>
		</Box>
	);
};

export default SignUpVerify;
