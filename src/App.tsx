import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
	PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { FC, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import { url } from './constants';
import Container from './components/Container';

require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {
	// const network = WalletAdapterNetwork.Devnet;
	const network = WalletAdapterNetwork.Devnet;
	// const endpoint = useMemo(() => clusterApiUrl('localnet'), network);
	const endpoint = url;
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
				<WalletModalProvider>
					<Container />
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

export default App;


