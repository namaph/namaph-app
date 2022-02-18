import { PublicKey } from '@solana/web3.js';
import { IRegistry } from '../model/model';
import ShowArweaveImage from './ShowArweaveImage';
import ShowTypes from './ShowTypes';
 

interface IShowRegistryProps {
	registry: IRegistry | null,
	pubkey: PublicKey,
}

const ShowHome = (props: IShowRegistryProps) => {

	if (props.registry) {
		const registry = props.registry;
		return (
			<div className="my-8 flex justify-between items-center">
				<div className="mr-3">
				<ShowTypes types={registry.types} size={registry.cellSize}/>
				</div>
				<div className="ml-3">
				<ShowArweaveImage txid={registry.topImageTxid}/>
				</div>
			</div>)
	} else {
		return (<div> loading Multisig</div>)
	}
}


export default ShowHome
