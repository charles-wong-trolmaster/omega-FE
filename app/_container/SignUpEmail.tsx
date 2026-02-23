import { ChangeEvent, useState } from 'react';

interface PasswordRequirement {
	label: string;
	test: (password: string) => boolean;
}

interface SignUpEmailProps {
	navigateTo: (component: string) => void;
}

const SignUpEmail: React.FC<SignUpEmailProps> = ({ navigateTo }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [email, setEmail] = useState('');

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

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value);
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleSignUp = (e: React.FormEvent) => {
		e.preventDefault();
		// Perform sign up logic here if needed
		navigateTo('setUpVerify');
	};

	return (
		<div>
			<div className="uk-margin">
				<h1 className="uk-margin-remove uk-text-bold uk-text-warning">Sign Up</h1>
			</div>

			<form onSubmit={handleSignUp}>
				<div className="uk-margin">
					<h5 className="uk-margin-xsmall-bottom uk-text-warning">Email *</h5>
					<div className="uk-inline uk-width-1-1">
						<span className="uk-form-icon" uk-icon="icon: mail"></span>
						<input className="uk-input uk-border-pill" placeholder="Email" type="email" value={email} onChange={handleEmailChange} />
					</div>
				</div>

				<div className="uk-margin">
					<h5 className="uk-margin-xsmall-bottom uk-text-warning">Password *</h5>
					<div className="uk-inline uk-width-1-1">
						<span className="uk-form-icon" uk-icon="icon: lock"></span>
						<a className="uk-form-icon uk-form-icon-flip" uk-icon={`icon: ${showPassword ? 'eye-slash' : 'eye'}`} onClick={() => setShowPassword(!showPassword)}></a>
						<input className="uk-input uk-border-pill" placeholder="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} />
					</div>
				</div>

				<div className="uk-margin">
					<h5 className="uk-margin-xsmall-bottom uk-text-warning">Confirm Password *</h5>
					<div className="uk-inline uk-width-1-1">
						<span className="uk-form-icon" uk-icon="icon: lock"></span>
						<a className="uk-form-icon uk-form-icon-flip" uk-icon={`icon: ${showConfirmPassword ? 'eye-slash' : 'eye'}`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></a>
						<input className="uk-input uk-border-pill" placeholder="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={handleConfirmPasswordChange} />
					</div>
				</div>

				<div className="uk-margin">
					<div className="uk-background-primary uk-padding-small uk-border-rounded">
						<div className="uk-margin-small">
							<h4 className="uk-margin-remove uk-text-warning uk-text-bold">Password must:</h4>
						</div>
						{requirements.map((requirement, index) => (
							<div key={index} className="uk-margin-small uk-flex uk-flex-middle">
								<span className={`uk-margin-small-right ${requirement.test(password) ? 'uk-text-secondary' : 'uk-text-danger'}`} uk-icon={`icon: ${requirement.test(password) ? 'check' : 'close'}; ratio: 0.8`}></span>
								<span className={`uk-text-small  ${requirement.test(password) ? 'uk-text-warning' : 'uk-text-warning'}`}>{requirement.label}</span>
							</div>
						))}
					</div>
				</div>

				<div className="uk-text-left uk-margin-small">
					<span className="uk-text-small uk-text-bold uk-text-warning">
						As a new user, a <span className="uk-text-bold">TM+ Pro</span> account has been created for you and the Omega service has been activated simultaneously.
					</span>
				</div>

				<div className="uk-margin">
					<button className="uk-button uk-button-secondary uk-button-large uk-width-1-1 uk-border-pill" type="submit">
						Sign Up
					</button>
				</div>
				<div className="uk-margin">
					<button
						className="uk-button uk-button-primary uk-button-large uk-width-1-1 uk-border-pill"
						onClick={(e) => {
							e.preventDefault();
							navigateTo('signUpUser');
						}}
					>
						Back
					</button>
				</div>
			</form>
		</div>
	);
};
export default SignUpEmail;
