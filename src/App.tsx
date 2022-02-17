import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Router, RouteComponentProps } from "@reach/router";
import Home from './views/Home';
import TopBar from './components/TopBar';
import Navigation from './components/Navigation';
import { WorkspaceContext } from './workspace';

require('@solana/wallet-adapter-react-ui/styles.css');

const Dash = (props: RouteComponentProps) => <div>dash</div>;

const App: FC = () => {

	const [network, ] = useState<null|string>('devnet');

	useEffect(() => {
	// setup workspace
	},[]);

    return (
		<WorkspaceContext.Provider value={ {network: network} }>
        <Context>
            <Content />
        </Context>
		</WorkspaceContext.Provider>
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
		[]
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
    return (
        <div className="App">
			<div className="font-bold text-3xl">
			<TopBar/>
            <WalletMultiButton />
			<Navigation/>
			<Router>
				<Home path="/" />
				<Dash path="dash" />
			</Router>
			</div>
        </div>
    );
};
