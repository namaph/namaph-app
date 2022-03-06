import { FC, useState, ChangeEvent } from 'react';
import { IMultisigTransaction } from '../model';
import { PublicKey } from '@solana/web3.js';
import { addTextTopic } from '../rpc';
// import { BN } from '@project-serum/anchor';
// import { spend } from '../rpc';
// import { fetchTreasury } from '../fetch';

type IProposeProps = {
	signer: PublicKey,
	mTx: IMultisigTransaction,
}

const ProposeAddTextTopic: FC<IProposeProps> = ({ signer, mTx }) => {

	let [title, setTitle] = useState('');
	let [body, setBody] = useState('');

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	}

	const handleBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setBody(e.target.value);
	}
	const disableButton = () => {
		if (title === '') return true;
		if (body === '') return true;
		return false;
	}

	const handleSubmit = async () => {
		await addTextTopic(
			title,
			body,
			signer,
			mTx
		);

		setTitle('');
		setBody('');
	}

	return (<>
		<div>
			<div>Plain Text: </div>
			<input value={title} onChange={handleTitleChange} />
			<textarea value={body} onChange={handleBodyChange} />
			<button className="disabled:bg-gray-200" onClick={handleSubmit} disabled={disableButton()}>submit</button>
		</div>
	</>
	)

}

export default ProposeAddTextTopic;
