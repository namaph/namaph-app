import { FC, useState, ChangeEvent, useEffect } from 'react';
import { IMultisigTransaction } from '../model';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
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
		if(amount <= 0) return true;

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
		<div className="flex flex-col max-w-lg mb-10 space-y-5">
			<div>
				<div className="font-semibold">Pay from DAO:</div>
				<p>DAO pays to specified address.</p>
			</div>
			<div className="text-xl flex flex-col space-y-5">
			<div>
				<div className="flex flex-row space-x-2 items-center">
				<span>amount:</span> <input className="py-3 px-5 text-right w-2/3" value={amount} onChange={handleAmountChange} /> <span>lamports</span>
				</div>
				<p className="text-sm text-right mt-1">(1 SOL = {LAMPORTS_PER_SOL} lamports)</p>
			</div>
			<div className="flex flex-row space-x-2 items-center">
				<span>address:</span><input className="py-3 px-5 text-lg w-2/3" value={targetString} onChange={handleTargetChange} />
			</div>
			</div>
			<button onClick={handleSubmit} disabled={disableButton()} className="p-3 bg-white border border-4 border-gray-800 font-semibold hover:bg-gray-500 hover:text-gray-100 hover:border-gray-500 active:bg-gray-800 active:border-gray-800 active:text-gray-100 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400 rounded-full"> submit </button>

		</div>
	</>
	)
}


export default ProposeSpend;
