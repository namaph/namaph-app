import { AnchorWallet } from '@solana/wallet-adapter-react';

interface IShowWalletProps {
	wallet: AnchorWallet | undefined,
}

const ShowWallet = (props: IShowWalletProps) => {

	if (props.wallet) {
		return (
			<div className="my-8">
				<h2>Wallet</h2>
				<div>{props.wallet.publicKey.toBase58()}</div>
			</div>)
	} else {
		return (<div> loading Wallet</div>)
	}
}


export default ShowWallet
