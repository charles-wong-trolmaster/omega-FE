'use client';

import Login from '@/app/_container/Login';
import OmegaForgot from '@/app/_container/OmegaForgot';
import ResetPassword from '@/app/_container/ResetPassword';
import SetUpOmega from '@/app/_container/SetUpOmega';
import SignInTMPro from '@/app/_container/SignInTMPro';
import SignUpEmail from '@/app/_container/SignUpEmail';
import SignUpUser from '@/app/_container/SignUpUser';
import SignUpVerify from '@/app/_container/SignUpVerify';
import TMProForgot from '@/app/_container/TMProForgotPassword';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import AllSet from './_container/AllSet';
import JoinTrolMasterSetupOmega from './_container/JoinTrolMasterSetupOmega';

const LoginPage = () => {
	const [activeComponent, setActiveComponent] = useState('login');
	const [registerData, setRegisterData] = useState<any>(null);
	const [initialCompanyId, setInitialCompanyId] = useState<string>('');

	// Navigation handler
	const navigateTo = (component: string) => {
		setActiveComponent(component);
	};

	const renderComponent = () => {
		switch (activeComponent) {
			case 'login':
				return <Login navigateTo={navigateTo} initialCompanyId={initialCompanyId} />;
			case 'forgot':
				return <OmegaForgot navigateTo={navigateTo} />;
			case 'forgotTMPro':
				return <TMProForgot navigateTo={navigateTo} />;
			case 'reset':
				return <ResetPassword navigateTo={navigateTo} />;
			case 'signUpUser':
				return <SignUpUser navigateTo={navigateTo} />;
			case 'signInTMPro':
				return <SignInTMPro navigateTo={navigateTo} setInitialCompanyId={setInitialCompanyId} />;
			case 'signUpEmail':
				return <SignUpEmail navigateTo={navigateTo} />;
			case 'setUpOmega':
				return <SetUpOmega navigateTo={navigateTo} />;
			case 'setUpVerify':
				return <SignUpVerify navigateTo={navigateTo} registerData={registerData} setInitialCompanyId={setInitialCompanyId} />;
			case 'allSet':
				return <AllSet navigateTo={navigateTo} />;
			case 'signUpBoth':
				return <JoinTrolMasterSetupOmega navigateTo={navigateTo} setRegisterData={setRegisterData} />;
			default:
				return <Login navigateTo={navigateTo} />;
		}
	};

	return (
		<div className="login-background">
			<Grid container spacing={2}>
				<Grid size={4}>123</Grid>
				<Grid size={4}>
					<Container style={{ display: 'flex', justifyContent: 'center' }}>
						123423
						{renderComponent()}
					</Container>
				</Grid>
				<Grid size={4}>123</Grid>
			</Grid>
		</div>
	);
};

export default LoginPage;
