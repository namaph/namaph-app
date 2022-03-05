import { FC, useState, ChangeEvent, useEffect } from 'react';
import { IMultisigTransaction } from '../model';
import { PublicKey } from '@solana/web3.js';
import { addMember } from '../rpc';

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
		await addMember(
			new PublicKey(userStringKey),
			username,
			signer,
			mTx
		);

		setUsername('');
		setUserStringKey('');
	}

	return (<>
		<div>
			<div>Add a member:</div>
			<input value={username} placeholder='username' onChange={handleNameChange} />
			<input value={userStringKey} placeholder='public key' onChange={handleKeyChange} />
			<button className="disabled:bg-gray-200" onClick={handleSubmit} disabled={disableButton()}>submit</button>
		</div>
	</>
	)
}

export default ProposeAddOwner;
