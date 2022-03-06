import { FC, useState, useEffect, ChangeEvent } from 'react';
import { IMultisigTransaction, ITopology } from '../model';
import { PublicKey } from '@solana/web3.js';
import { updateTopology } from '../rpc';
import { fetchTopology } from '../fetch';
import { projectName } from '../constants';
import { getCityIoValues, getCityIoNodeLabels } from '../cityio';

type IProposeProps = {
	signer: PublicKey,
	mTx: IMultisigTransaction,
}

const ProposeUpdateTopology: FC<IProposeProps> = ({ signer, mTx }) => {

	const [nodeLabels, setNodeLabels] = useState<string[]>([]);
	const [nodeValues, setNodeValues] = useState<number[]>([]);
	const [targetNode, setTargetNode] = useState<number>(0);
	const [targetValue, setTargetValue] = useState<number>(0);
	const [topologyAccount, setTopologyAccount] = useState<undefined | { publicKey: PublicKey, data: ITopology }>(undefined);
	const [disabled, setDisabled] = useState<boolean>(true);

	useEffect(() => {
		const getData = async () => {
			const labels = await getCityIoNodeLabels();
			const values = await getCityIoValues();
			setNodeLabels(labels);
			setNodeValues(values);
			console.log(values);
			const account = await fetchTopology(projectName);
			setTopologyAccount(account);
		}
		getData();
	}, [])

	const labelSelect = () => {
		if (nodeLabels.length !== 0) {
			const options = nodeLabels.map((v, i) => {
				return (<option value={i} key={`${i}-${v}`}>{v}</option>)
			})
			return (
				<select className="p-3 px-5 rounded-full bg-white font-semibold text-xl" name="label" onChange={labelChange}>
					{options}
				</select>
			)
		}
	}

	const labelChange = (e: ChangeEvent<HTMLSelectElement>) => {
		console.log('label', e.target.value);
		setTargetNode(parseInt(e.target.value));
		checkDisabled();
	}

	const valueSelect = () => {
		if (nodeLabels.length !== 0) {
			const options = [0, 1, 2, 3].map((v) => {
				return (<option key={`value-${v}`} value={v}>{v}</option>)
			})
			return (
				<select className="p-3 px-5 rounded-full bg-white font-semibold text-xl" name="value" onChange={valueChange}>
					{options}
				</select>
			)
		}
	}

	const valueChange = (e: ChangeEvent<HTMLSelectElement>) => {
		console.log('value', e.target.value);
		setTargetNode(parseInt(e.target.value));
		checkDisabled();
	}

	const checkDisabled = () => {
		console.log('node',targetNode);
		console.log('set', targetValue);
		console.log('current value',nodeValues[targetNode]);

		if(!topologyAccount) {
			setDisabled(true);
			return;
		}

		// if(nodeValues[targetNode] === targetValue) {
		// 	setDisabled(true);
		// 	return;
		// }

		if(targetNode === -1 || targetValue === -1) {
			setDisabled(true);
			return;
		}

		setDisabled(false);
	}

	const handleSubmit = async () => {
		if (topologyAccount) {
			const update = { id: targetNode, value: targetValue };
			await updateTopology(
				topologyAccount.publicKey,
				update,
				signer,
				mTx
			);
		}

		setTargetNode(-1);
		setTargetValue(-1);
	}

	return (<>
		<div className="flex flex-col max-w-lg mb-10 space-y-5">
			<div>
				<div className="font-semibold">Update Node Value:</div>
				<p>changes the value of the selected node</p>
			</div>
			<div className="flex flex-row justify-between pr-3 text-xl">
				<div>
					label: {labelSelect()}
				</div>
				<div>
					value: {valueSelect()}
				</div>
			</div>
			<button onClick={handleSubmit} disabled={disabled} className="p-3 bg-white border border-4 border-gray-800 font-semibold hover:bg-gray-500 hover:text-gray-100 hover:border-gray-500 active:bg-gray-800 active:border-gray-800 active:text-gray-100 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400 rounded-full"> submit </button>
		</div>
	</>
	)
}


export default ProposeUpdateTopology;
