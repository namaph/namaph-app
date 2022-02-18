import { ConnectionProvider, useAnchorWallet, WalletProvider, AnchorWallet} from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
	PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { FC, ReactNode, useMemo, useEffect, useState } from 'react';
import { Router } from "@reach/router";
import Home from './views/Home';
import Init from './views/Init';
import Status from './views/Status';
import List from './views/List';
import Propose from './views/Propose';
import TopBar from './components/TopBar';
import Navigation from './components/Navigation';
import shardIdl from './idl/shard.json';
import multisigIdl from './idl/serum_multisig.json';
import { Idl, Wallet, Provider, Program } from '@project-serum/anchor';
import { createContext } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

require('@solana/wallet-adapter-react-ui/styles.css');

export interface IContextPrograms {
	shardProgram: Program<Idl> | undefined,
	multisigProgram: Program<Idl> | undefined,
	wallet: AnchorWallet | undefined;
	provider: Provider | undefined;
} 

export const WorkspaceContext = createContext({
	shardProgram: undefined,
	multisigProgram: undefined,
	wallet: undefined
} as IContextPrograms);


const App: FC = () => {
	return (
			<Context>
				<Content/>
			</Context>
	);
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
	// The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
	const network = WalletAdapterNetwork.Devnet;

	// You can also provide a custom RPC endpoint.
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	// @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
	// Only the wallets you configure here will be compiled into your application, and only the dependencies
	// of wallets that your users connect to will be loaded.
	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
		],
		// eslint-disable-next-line
		[network]
	);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

const Content: FC = () => {

	const aWallet = useAnchorWallet();
	// console.log(aWallet);

	const [shardProgram, setShardProgram] = useState<undefined | Program<Idl>>(undefined);
	const [multisigProgram, setMultiProgram] = useState<undefined | Program<Idl>>(undefined);
	const [wallet, setWallet] = useState<undefined | AnchorWallet>(undefined);
	const [provider, setProvider] = useState<undefined | Provider>(undefined);
 
	// init workspace
	useEffect(() => {
		if(aWallet){
			const commitment = 'processed';
			const shardId = new PublicKey(shardIdl.metadata.address);
			const multisigId = new PublicKey(multisigIdl.metadata.address);
			const connection = new Connection('https://api.devnet.solana.com', commitment);
			const provider = new Provider(connection, aWallet as Wallet, { preflightCommitment: commitment, commitment });
			const shardProgram = new Program(shardIdl as Idl, shardId, provider);
			const multisigProgram = new Program(multisigIdl as Idl, multisigId, provider);

			setShardProgram(shardProgram);
			setMultiProgram(multisigProgram);
			setWallet(aWallet);
			setProvider(provider);
		}
	}, [aWallet])


	return (
		<WorkspaceContext.Provider value={{
			shardProgram,
			multisigProgram,
			wallet,
			provider
		}}>
			<div className="container mx-auto px-6 py-16 max-w-screen-lg">
				<div className="flex justify-between mb-16">
				<TopBar />
				<div className="w-1/5">
				<WalletMultiButton />
				</div>
				</div>
				<Navigation />
				<Router>
					<Home path="/" />
					<Init path="init" />
					<Status path="status" />
					<Propose path="propose" />
					<List path="list" />
				</Router>
			</div>
		</WorkspaceContext.Provider>
	);
};
