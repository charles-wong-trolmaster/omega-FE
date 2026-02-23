import { ChangeEvent, useState } from 'react';

interface PasswordRequirement {
	label: string;
	test: (password: string) => boolean;
}

interface ResetPasswordProps {
	navigateTo: (component: string) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ navigateTo }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

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

	return (
		<div className="uk-width-large">
			<div className="uk-margin">
				<h1 className=" uk-margin-remove uk-text-bold uk-text-warning">Reset Your Password</h1>
			</div>
			<form>
				<div className="uk-margin">
					<div className="uk-margin-xsmall-bottom ">
						<h5 className="uk-margin-remove uk-text-warning">Password *</h5>
					</div>
					<div className="uk-inline uk-width-1-1">
						<span className="uk-form-icon" uk-icon="icon: lock"></span>
						<a className="uk-form-icon uk-form-icon-flip" uk-icon={`icon: ${showPassword ? 'eye-slash' : 'eye'}`} onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}></a>
						<input className="uk-input uk-border-pill" placeholder="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} />
					</div>
				</div>

				<div className="uk-margin">
					<div className="uk-margin-xsmall-bottom ">
						<h5 className="uk-margin-remove uk-text-warning">Confirm Password *</h5>
					</div>
					<div className="uk-inline uk-width-1-1">
						<span className="uk-form-icon" uk-icon="icon: lock"></span>
						<a className="uk-form-icon uk-form-icon-flip" uk-icon={`icon: ${showConfirmPassword ? 'eye-slash' : 'eye'}`} onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: 'pointer' }}></a>
						<input className="uk-input uk-border-pill" placeholder="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={handleConfirmPasswordChange} />
					</div>
				</div>

				<div className="uk-margin">
					<div className="uk-background-primary uk-padding-small uk-border-rounded">
						<div className="uk-margin-small">
							<div className="uk-margin-xsmall-bottom ">
								<h5 className="uk-margin-remove uk-text-warning">Password must:</h5>
							</div>
						</div>
						{requirements.map((requirement, index) => (
							<div key={index} className="uk-margin-small uk-flex uk-flex-middle">
								<span className={`uk-margin-small-right ${requirement.test(password) ? 'uk-text-secondary' : 'uk-text-danger'}`} uk-icon={`icon: ${requirement.test(password) ? 'check' : 'close'}; ratio: 0.8`}></span>
								<span className={`uk-text-small  ${requirement.test(password) ? 'uk-text-warning' : 'uk-text-warning'}`}>{requirement.label}</span>
							</div>
						))}
					</div>
				</div>

				<div className="uk-margin">
					<button
						className="uk-button uk-button-secondary uk-button-large uk-width-1-1 uk-border-pill"
						onClick={(e) => {
							e.preventDefault();
						}}
					>
						Confirm
					</button>
				</div>
			</form>
		</div>
	);
};
export default ResetPassword;
