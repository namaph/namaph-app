import { PublicKey } from '@solana/web3.js';
import { IRegistry } from '../model/model';
import ShowArweaveImage from './ShowArweaveImage';
import ShowTypes from './ShowTypes';
 

interface IShowRegistryProps {
	registry: IRegistry | null,
	pubkey: PublicKey,
}

const ShowRegistry = (props: IShowRegistryProps) => {

	if (props.registry) {
		const registry = props.registry;
		return (
			<div className="my-8">
				<h2>Registry</h2>
				<div>{props.pubkey.toBase58()}</div>
				<div>multisig:{registry.multisig.toBase58()}</div>
				<div>name:{registry.name}</div>
				<ShowArweaveImage txid={registry.topImageTxid}/>
				<div>cellSize:{registry.cellSize}</div>
				<ShowTypes types={registry.types} size={registry.cellSize}/>
			</div>)
	} else {
		return (<div> loading Multisig</div>)
	}
}


export default ShowRegistry
