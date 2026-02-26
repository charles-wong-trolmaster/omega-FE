'use client';

import Login from '@/app/_container/Login';
import OmegaForgot from '@/app/_container/OmegaForgot';
import ResetPassword from '@/app/_container/ResetPassword';
import SetUpOmega from '@/app/_container/SetUpOmega';
import SignInTMPro from '@/app/_container/SignInTMPro';
import SignUpEmail from '@/app/_container/SignUpEmail';
import SignUpUser from '@/app/_container/SignUpUser';
import SignUpVerify from '@/app/_container/SignUpVerify';
import TMProForgotPassword from '@/app/_container/TMProForgotPassword';
import { Box, Container, Stack } from '@mui/material';
import { useState } from 'react';
import AllSet from './_container/AllSet';
import JoinTrolMasterSetupOmega from './_container/JoinTrolMasterSetupOmega';

const LoginPage = () => {
	const [activeComponent, setActiveComponent] = useState('login');
	const [registerData, setRegisterData] = useState<any>(null);
	const [initialCompanyId, setInitialCompanyId] = useState<string>('');

	const navigateTo = (component: string) => {
		setActiveComponent(component);
	};

	const getComponentMaxWidth = () => {
		switch (activeComponent) {
			case 'signUpBoth':
			case 'signInTMPro':
			case 'allSet':
				return 720;

			default:
				return 450;
		}
	};

	const renderComponent = () => {
		switch (activeComponent) {
			case 'login':
				return <Login navigateTo={navigateTo} initialCompanyId={initialCompanyId} />;
			case 'forgot':
				return <OmegaForgot navigateTo={navigateTo} />;
			case 'forgotTMPro':
				return <TMProForgotPassword navigateTo={navigateTo} />;
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
			<Container sx={{ paddingTop: '80px', paddingBottom: '80px' }}>
				<Box sx={{ maxWidth: getComponentMaxWidth(), mx: 'auto', width: '100%' }}>
					<Stack spacing={5}>
						<Box>
							<img src="/img/trolmasterLogo.svg" alt="" />
						</Box>
						<Box>{renderComponent()}</Box>
					</Stack>
				</Box>
			</Container>
		</div>
	);
};

export default LoginPage;
