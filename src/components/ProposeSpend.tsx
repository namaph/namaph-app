import { FC, useState, ChangeEvent, useEffect } from 'react';
import { IMultisigTransaction } from '../model';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { spend } from '../rpc';
import { fetchTreasury } from '../fetch';

type IProposeSpendProps = {
	signer: PublicKey,
	mTx: IMultisigTransaction,
}

const ProposeSpend: FC<IProposeSpendProps> = ({ signer, mTx }) => {

	const [amount, setAmount] = useState<number>(0);
	const [targetString, setTargetString] = useState<string>('');
	const [treasury, setTreasury] = useState<undefined | PublicKey>(undefined);

	useEffect(() => {
		const getData = async () => {
			const treasuries = await fetchTreasury(mTx.multisig);
			setTreasury(treasuries[0].publicKey);
		}
		getData();
	}, [mTx.multisig])

	const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
		
		if(isNaN(parseInt(e.target.value))) {
			setAmount(0);
		} else {
			setAmount(parseInt(e.target.value));
		}
	}

	const handleTargetChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTargetString(e.target.value);
	}
	const disableButton = () => {
		
		if(!treasury) return true;
		if(targetString === '') return true;
		if(amount < 0) return true;

		return false;
	}

	const handleSubmit = async () => {
		if(treasury) {
		await spend(
			treasury,
			new PublicKey(targetString),
			new BN(amount),
			signer,
			mTx
		);
		setTargetString('');
		setAmount(0);
		}
	}

	return (<>
		<div>
			<div>Pay: </div>
			<input value={amount} onChange={handleAmountChange} />
			<input value={targetString} onChange={handleTargetChange} />
			<button className="disabled:bg-gray-200" onClick={handleSubmit} disabled={disableButton()}>submit</button>
		</div>
	</>
	)
}


export default ProposeSpend;
