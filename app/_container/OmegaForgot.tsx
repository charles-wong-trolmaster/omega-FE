'use client';

import { useState } from 'react';

interface ForgotProps {
	navigateTo: (component: string) => void;
}

const OmegaForgotPassword: React.FC<ForgotProps> = ({ navigateTo }) => {
	const [activeTab, setActiveTab] = useState('company');

	return (
		<div className="uk-width-large">
			<h1 className="uk-h1 uk-text-bold uk-text-warning">Forgot</h1>

			<div className="uk-margin-bottom uk-grid-collapse uk-child-width-1-2 uk-background-primary uk-border-pill uk-text-warning" uk-grid="true">
				<div>
					<button onClick={() => setActiveTab('company')} className={`uk-button uk-border-pill uk-width-1-1 ${activeTab === 'company' ? 'uk-button-secondary' : 'uk-background-primary'}`}>
						COMPANY ID
					</button>
				</div>
				<div>
					<button onClick={() => setActiveTab('password')} className={`uk-button uk-border-pill uk-width-1-1 ${activeTab === 'password' ? 'uk-button-secondary' : 'uk-background-primary'}`}>
						PASSWORD
					</button>
				</div>
			</div>

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

				<p className="uk-margin uk-text-warning uk-text-bold">{`${activeTab === 'company' ? 'We have sent your Company ID to the email address you provided.' : 'You will receive a link create a new password via e-mail.'} `}</p>

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
							navigateTo('login');
						}}
					>
						Back
					</button>
				</div>
			</div>
		</div>
	);
};

export default OmegaForgotPassword;
