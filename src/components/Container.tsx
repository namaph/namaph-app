import { useEffect, useState } from 'react';
import { Router } from '@reach/router';

import { AppStateContext } from '../workspace';

import Header from './Header';
import Footer from './Footer';
import Home from '../views/Home';
import List from '../views/List';
import Join from '../views/Join';
import Propose from '../views/Propose';
import { AppState } from '../model';
import { useWallet } from '@solana/wallet-adapter-react';
import { projectName } from '../constants';
import { checkIfMember } from '../fetch';

const Container = () => {
	const [appState, setAppState] = useState(AppState.Disconnected);
	const [isMember, setIsMember] = useState(false);
	const { connected, publicKey: address } = useWallet();

	useEffect(() => {
		
		if(appState === AppState.Disconnected && connected) {
			setAppState(AppState.WalletConnected);
		}

		if(appState !== AppState.Disconnected && !connected) {
			setAppState(AppState.Disconnected);
		}

		if(appState === AppState.WalletConnected) {
			const check = async () => {
				const result = await checkIfMember(projectName, address!);
				if (result) {
					setIsMember(result);
					setAppState(AppState.Member);
				}
				
			}
			check();
		}

	}, [connected, appState, isMember, address])

	return (
			<AppStateContext.Provider value={appState}>
			<div className="container mx-auto px-6 py-16 max-w-screen-lg">
				<Header />
				<Router className="mt-6">
					<Home path="/" />
					<List path="list" />
					<Propose path="propose" />
					<Join path="join" />
				</Router>
				<Footer />
			</div>
			</AppStateContext.Provider>
	);
};

export default Container;
