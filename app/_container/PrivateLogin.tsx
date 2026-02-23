'use client';

interface LoginProps {
	email: string;
	setEmail: (value: string) => void;
	password: string;
	setPassword: (value: string) => void;
	rememberMe: boolean;
	setRememberMe: (value: boolean) => void;
	showPassword: boolean;
	setShowPassword: (value: boolean) => void;
	isLoading: boolean;
	error: string | null;
	setError: (value: string | null) => void;
	isButtonDisabled: boolean;
	handleLogin: (e: React.FormEvent) => void;
	navigateTo: (component: string) => void;
}

const PrivateLogin: React.FC<LoginProps> = ({
	email,
	setEmail,
	password,
	setPassword,

	rememberMe,
	setRememberMe,
	showPassword,
	setShowPassword,
	isLoading,
	error,
	setError,
	isButtonDisabled,
	handleLogin,
	navigateTo
}) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !isButtonDisabled && !isLoading) {
			handleLogin(e as any);
		}
	};

	return (
		<div className="uk-width-large" onKeyDown={handleKeyDown}>
			<div className="uk-margin">
				<h3 className="uk-margin-remove uk-h1 uk-text-bold uk-text-warning">Welcome to OMEGA</h3>
				{/* <h1 className="uk-margin-remove uk-h1 uk-text-bold uk-text-warning">
          OMEGA
        </h1> */}
			</div>
			<form onSubmit={handleLogin}>
				<div className="uk-margin">
					<h5 className="uk-margin-xsmall-bottom uk-text-warning">Email *</h5>
					<div className="uk-inline uk-width-1-1">
						<span className="uk-form-icon" uk-icon="icon: mail"></span>
						<input className="uk-input uk-border-pill" placeholder="E-mail Address / Username" type="text" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} autoComplete="username" />
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
								if (!isLoading) setShowPassword(!showPassword);
							}}
							style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
						></a>
						<input
							className={`uk-input uk-border-pill ${error ? 'uk-form-danger' : ''}`}
							placeholder="Password"
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setError(null);
							}}
							disabled={isLoading}
							autoComplete="current-password"
						/>
					</div>
					{error && <div className="uk-text-danger uk-text-small uk-margin-small-top">{error}</div>}
				</div>

				<div className="uk-margin-small">
					<label className="uk-text-small uk-text-warning uk-text-bold uk-flex uk-flex-middle">
						<input className="uk-checkbox uk-border-pill uk-margin-remove " type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={isLoading} />
						<span className="uk-text-warning uk-margin-small-left">Stay logged in</span>
					</label>
				</div>

				<div className="uk-margin">
					<button className="uk-button uk-button-secondary uk-button-large uk-width-1-1 uk-border-pill" type="submit" disabled={isButtonDisabled || isLoading}>
						{isLoading ? <div uk-spinner="ratio: 0.6"></div> : 'Log In'}
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
						Forgot Password?
					</a>
				</div>
			</form>
		</div>
	);
};

export default PrivateLogin;
