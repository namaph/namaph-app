import { FC, useState, useEffect, ChangeEvent } from 'react';
import { IMultisigTransaction, ITopology, IUpdateTopologyData } from '../model';
import { PublicKey } from '@solana/web3.js';
import { updateTopology } from '../rpc';
import { fetchTopology } from '../fetch';
import { projectName, landTypes } from '../constants';
import { getCityIoValues, getCityIoNodeLabels } from '../cityio';

type IProposeProps = {
	signer: PublicKey,
	mTx: IMultisigTransaction,
}

const ProposeUpdateTopology: FC<IProposeProps> = ({ signer, mTx }) => {

	const [nodeLabels, setNodeLabels] = useState<string[]>([]);
	const [nodeValues, setNodeValues] = useState<number[]>([]);
	const [updateInfo, setUpdateInfo] = useState<IUpdateTopologyData>(
		{ id: -1, value: -1 }
	);
	const [topologyAccount, setTopologyAccount] = useState<undefined | { publicKey: PublicKey, data: ITopology }>(undefined);
	const [disabled, setDisabled] = useState<boolean>(true);

	useEffect(() => {
		if (nodeValues.length === 0 || nodeLabels.length === 0) {
			const getData = async () => {
				setNodeLabels(await getCityIoNodeLabels());
				setNodeValues(await getCityIoValues());
				const account = await fetchTopology(projectName);
				setTopologyAccount(account);
			}
			getData();
		}
	}, [nodeValues, nodeLabels])

	const labelSelect = () => {
		if (nodeLabels.length !== 0) {
			const options = nodeLabels.map((v, i) => {
				return (<option value={i} key={`${i}-${v}`}>{v}</option>)
			})
			return (
				<select className="p-3 px-5 rounded-full bg-white font-semibold text-3xl" name="label" onChange={labelChange}>
					{options}
				</select>
			)
		}
	}

	const labelChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setUpdateInfo({ ...updateInfo, id: parseInt(e.target.value) });
		if (updateInfo.value === -1) setDisabled(true);
		else if (nodeValues[parseInt(e.target.value)] === updateInfo.value) setDisabled(true);
		else setDisabled(false);
	}

	const valueSelect = () => {
		if (nodeLabels.length !== 0) {
			const options = landTypes.map((v, i) => {
				return (<option key={`value-${v}`} value={i}>{v}</option>)
			})
			return (
				<select className="p-3 px-5 rounded-full bg-white font-semibold text-3xl" name="value" onChange={valueChange}>
					{options}
				</select>
			)
		}
	}

	const valueChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setUpdateInfo({ ...updateInfo, value: parseInt(e.target.value) });
		if (updateInfo.id === -1) setDisabled(true);
		else if (nodeValues[updateInfo.id] === parseInt(e.target.value)) setDisabled(true);
		else setDisabled(false);
	}

	const handleSubmit = async () => {
		if (topologyAccount) {
			await updateTopology(
				topologyAccount.publicKey,
				updateInfo,
				signer,
				mTx
			);
		}
		setDisabled(true);
	}

	const current =() => {
		if(updateInfo.id !== -1) {
			return(
			<div className="mt-3">
				current land type: {landTypes[nodeValues[updateInfo.id]]}
			</div>)	
		}
	}

	return (<>
		<div className="flex flex-col mb-10 space-y-5">
			<div>
				<div className="font-semibold">Update Node Value:</div>
				<p className="max-w-lg">changes the value of the selected node. The cooresponding node and its connections are shown below. The values indicate the following.</p>
				<img className="w-full" src={`${process.env.PUBLIC_URL}topology.png`} alt="topology" />
			</div>
			<div className="max-w-lg">
				<div className="flex flex-col pr-3 text-xl mb-5">
					<div className="text-left mb-3">
						Change zone:
					</div>
					<div className="flex flex-row place-items-center">
						<div>
							{labelSelect()}
						</div>
						<div className="px-2">
							to
						</div>
						<div>
							{valueSelect()}
						</div>
						</div>
					{current()}
				</div>
				<button onClick={handleSubmit} disabled={disabled} className="p-3 bg-white border border-4 border-gray-800 font-semibold hover:bg-gray-500 hover:text-gray-100 hover:border-gray-500 active:bg-gray-800 active:border-gray-800 active:text-gray-100 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400 rounded-full"> submit </button>
			</div>
		</div>
	</>
	)
}


export default ProposeUpdateTopology;
