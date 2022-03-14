import { FC, useState, ChangeEvent, useEffect } from 'react';
import { IMultisigTransaction } from '../model';
import { PublicKey } from '@solana/web3.js';
import { addMember } from '../rpc';
import bs58 from 'bs58';

type IProposeAddOwnerProps = {
	signer: PublicKey,
	mTx: IMultisigTransaction,
}

const ProposeAddOwner: FC<IProposeAddOwnerProps> = ({ signer, mTx }) => {

	const [userStringKey, setUserStringKey] = useState<string>('');
	const [username, setUsername] = useState<string>('');

	useEffect(() => {
		const getData = async () => {
		}
		getData();
	}, [])

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	}

	const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUserStringKey(e.target.value);
	}
	const disableButton = () => {
		if(username === '') return true;
		if(userStringKey === '') return true;
		return false;
	}

	const handleSubmit = async () => {

		const userPubKey = new PublicKey(userStringKey);
		const userBase58 = bs58.encode(Buffer.from(username));

		await addMember(
			userPubKey,
			userBase58,
			signer,
			mTx
		);

		setUsername('');
		setUserStringKey('');
	}

	return (<>
		<div className="flex flex-col max-w-lg mb-10 space-y-5">
			<div>
				<div className="font-semibold">Invite a member:</div>
				<p>For verification, a twitter or github handle is required. If you have someone to invite, first have them in the dedicated discord server.</p>
			</div>
			<div className="text-xl flex flex-col space-y-5">
			<div>
				<div className="flex flex-row space-x-2 items-center">
				<span>username: </span> <input className="py-3 px-5 text-center w-2/3" value={username} onChange={handleNameChange} />
				</div>
			</div>
			<div className="flex flex-row space-x-2 items-center">
				<span>address:</span><input className="py-3 px-5 text-lg w-2/3 text-center" value={userStringKey} onChange={handleKeyChange} />
			</div>
			</div>
			<button onClick={handleSubmit} disabled={disableButton()} className="p-3 bg-white border border-4 border-gray-800 font-semibold hover:bg-gray-500 hover:text-gray-100 hover:border-gray-500 active:bg-gray-800 active:border-gray-800 active:text-gray-100 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400 rounded-full"> submit </button>

		</div>
	</>
	)

}

export default ProposeAddOwner;
