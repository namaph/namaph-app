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

	const [threshold, setThreshold] = useState<number>(-1);
	const [multisigData, setMultisigData] = useState<undefined | IMultisig>(undefined);

	useEffect(() => {
		const getData = async () => {
			const multisigAccount = await fetchMultisig(mTx.multisig);
			setMultisigData(multisigAccount.data);
		}

		getData();
	}, [mTx.multisig])


	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		
		if(isNaN(parseInt(e.target.value))) {
			setThreshold(1);
		} else {
			setThreshold(parseInt(e.target.value));
		}
	}

	const disableButton = () => {
		if(!multisigData) return true;
		if(multisigData.threshold.toString() === (new BN(threshold).toString())) return true;

		if(threshold < 1 || threshold > multisigData.owners.length) return true;

		return false;
	}

	const handleSubmit = async () => {
		await changeThreshold(
			new BN(threshold),
			signer,
			mTx
		);
		setThreshold(-1);
	}

	return (<>
		<div>
			<div>Update threshold:</div>
			<input value={threshold} onChange={handleChange} />
			<button className="disabled:bg-gray-200" onClick={handleSubmit} disabled={disableButton()}>submit</button>
		</div>
	</>
	)
}


export default ProposeChangeThreshold;
