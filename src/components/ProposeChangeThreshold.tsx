import { FC, useState, ChangeEvent, useEffect } from 'react';
import { IMultisig, IMultisigTransaction } from '../model';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { changeThreshold } from '../rpc';
import { fetchMultisig } from '../fetch';


type IProposeChangeThresholdProps = {
	signer: PublicKey,
	mTx: IMultisigTransaction,
}

const ProposeChangeThreshold: FC<IProposeChangeThresholdProps> = ({ signer, mTx }) => {

	const [threshold, setThreshold] = useState<string>("0");
	const [multisigData, setMultisigData] = useState<undefined | IMultisig>(undefined);

	useEffect(() => {
		const getData = async () => {
			const multisigAccount = await fetchMultisig(mTx.multisig);
			setMultisigData(multisigAccount.data);
		}

		getData();
	}, [mTx.multisig])


	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setThreshold(e.target.value);		
	}

	const disableButton = () => {
		if(!multisigData) return true;
		const thresholdNumber = parseInt(threshold);
		if(isNaN(thresholdNumber)) return true;
		if(multisigData.threshold.toString() === (new BN(threshold).toString())) return true;
		if(thresholdNumber < 1 || thresholdNumber > multisigData.owners.length) return true;

		return false;
	}

	const handleSubmit = async () => {
		const thresholdNumber = parseInt(threshold);	
		await changeThreshold(
			new BN(thresholdNumber),
			signer,
			mTx
		);
		setThreshold("");
	}

	const blur = ()=> {
		if(isNaN(parseInt(threshold))) {
			setThreshold("0");
		}
	}

	return (<>
		<div className="flex flex-col max-w-lg mb-10 space-y-5">
			<div>
				<div className="font-semibold">Change Threshold:</div>
				<p>The threshold is the minimum number of approvals of required for a topic to pass. Otherwise known as quorum.</p>
			</div>
			<div className="text-xl flex flex-col space-y-5">
			<div>
				<div className="flex flex-row space-x-2 items-center">
				<span>threshold: </span> <input className="py-3 px-5 text-center w-2/3" value={threshold} onChange={handleChange} />
				</div>
			</div>
			</div>
			<button onClick={handleSubmit} onBlur={blur} disabled={disableButton()} className="p-3 bg-white border border-4 border-gray-800 font-semibold hover:bg-gray-500 hover:text-gray-100 hover:border-gray-500 active:bg-gray-800 active:border-gray-800 active:text-gray-100 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400 rounded-full"> submit </button>

		</div>
	</>
	)
}


export default ProposeChangeThreshold;
