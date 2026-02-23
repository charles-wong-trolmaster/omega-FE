'use client';

interface ForgotProps {
	navigateTo: (component: string) => void;
}

const TMProForgotPassword: React.FC<ForgotProps> = ({ navigateTo }) => {
	return (
		<div className="uk-width-large">
			<h1 className="uk-h1 uk-text-bold uk-text-warning">Forgot Password</h1>

			<div>
				<p className="uk-margin uk-text-warning uk-text-bold">
					Please provide the email address that you used when signed up for your account. If you forgot your email. Please{' '}
					<a href="#" className="uk-text-secondary">
						<u>contact us</u>
					</a>
					.
				</p>

				<div className="uk-margin">
					<h5 className="uk-text-warning uk-margin-xsmall-bottom">Email *</h5>
					<div className="uk-inline uk-width-1-1 ">
						<span className="uk-form-icon" uk-icon="icon: mail"></span>
						<input className="uk-input uk-border-pill" placeholder="Email" type="email" />
					</div>
				</div>

				<p className="uk-margin uk-text-warning uk-text-bold">{'You will receive a link create a new password via e-mail.'}</p>

				<div>
					<button
						className="uk-button uk-button-secondary uk-button-large uk-width-1-1 uk-border-pill"
						onClick={(e) => {
							e.preventDefault();
						}}
					>
						Confirm
					</button>
				</div>
				<div className="uk-margin">
					<button
						className="uk-button uk-button-primary uk-button-large uk-width-1-1 uk-border-pill"
						onClick={(e) => {
							e.preventDefault();
							navigateTo('signInTMPro');
						}}
					>
						Back
					</button>
				</div>
			</div>
		</div>
	);
};

export default TMProForgotPassword;
