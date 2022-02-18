import { PublicKey } from '@solana/web3.js';
import { IMultisig } from '../model/model';


interface IShowMultisigProps {
	multisig: IMultisig | null,
	pubkey: PublicKey,
}

const ShowMultisig = (props: IShowMultisigProps) => {

	let owners = [];

	if (props.multisig) {
		for (let i in props.multisig.owners) {
			// console.log(owner);
			let pubkey = props.multisig.owners[i].toString();
			owners.push(<li key={pubkey}>{pubkey}</li>);
		}
	}

	if (props.multisig) {
		return (
			<div className="my-8">
				<h2>Multisig</h2>
				<div>{props.pubkey.toBase58()}</div>
				<div>nonce: {props.multisig.nonce.toString()}</div>
				<div>threshold: {props.multisig.threshold.toString()}</div>
				<div>seq: {props.multisig.ownerSetSeqno.toString()}</div>
				<div>owners: </div>
				<ul>
					{owners}
				</ul>
			</div>)
	} else {
		return (<div> loading Multisig</div>)
	}
}


export default ShowMultisig
