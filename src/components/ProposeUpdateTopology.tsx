import { FC, useState, ChangeEvent, useEffect } from 'react';
import { IMultisigTransaction, ITopology } from '../model';
import { PublicKey } from '@solana/web3.js';
import { updateTopology } from '../rpc';
import { fetchTopology } from '../fetch';
import { projectName } from '../constants';

type IProposeProps = {
	signer: PublicKey,
	mTx: IMultisigTransaction,
}

const ProposeUpdateTopology: FC<IProposeProps> = ({ signer, mTx }) => {

	const [nodeId, setNodeId] = useState<number>(-1);
	const [nodeValue, setNodeValue] = useState<number>(-1);
	const [topologyAccount, setTopologyAccount] = useState<undefined | { publicKey: PublicKey, data: ITopology }>(undefined);

	useEffect(() => {
		const getData = async () => {
			const account = await fetchTopology(projectName);
			setTopologyAccount(account);
		}
		getData();
	}, [])

	const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {

		if (isNaN(parseInt(e.target.value))) {
			setNodeId(-1);
		} else {
			setNodeId(parseInt(e.target.value));
		}
	}

	const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {

		if (isNaN(parseInt(e.target.value))) {
			setNodeValue(-1);
		} else {
			setNodeValue(parseInt(e.target.value));
		}
	}

	const disableButton = () => {
		if (!topologyAccount) return true;
		if (nodeId < 0) return true;
		if (nodeValue < 0) return true;

		return false;
	}

	const handleSubmit = async () => {
		if (topologyAccount) {
			const update = { id: nodeId, value: nodeValue };
			await updateTopology(
				topologyAccount.publicKey,
				update,
				signer,
				mTx
			);
		}

		setNodeId(-1);
		setNodeValue(-1);
	}

	return (<>
		<div>
			<div>update topology:</div>
			<input value={nodeId} onChange={handleIdChange} />
			<input value={nodeValue} onChange={handleValueChange} />
			<button className="disabled:bg-gray-200" onClick={handleSubmit} disabled={disableButton()}>submit</button>
		</div>
	</>
	)
}


export default ProposeUpdateTopology;
