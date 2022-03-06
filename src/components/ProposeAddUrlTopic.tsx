import { FC, useState, ChangeEvent } from 'react';
import { IMultisigTransaction } from '../model';
import { PublicKey } from '@solana/web3.js';
import { addUrlTopic } from '../rpc';
// import { BN } from '@project-serum/anchor';
// import { spend } from '../rpc';
// import { fetchTreasury } from '../fetch';

type IProposeProps = {
	signer: PublicKey,
	mTx: IMultisigTransaction,
}

const ProposeAddUrlTopic: FC<IProposeProps> = ({ signer, mTx }) => {

	let [title, setTitle] = useState('');
	let [url, setUrl] = useState('');

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	}

	const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value);
	}
	const disableButton = () => {
		if (title === '') return true;
		if (url === '') return true;
		return false;
	}

	const handleSubmit = async () => {
		await addUrlTopic(
			title,
			url,
			signer,
			mTx
		);

		setTitle('');
		setUrl('');
	}

	return (<>
		<div>
			<div>Url: </div>
			<input value={title} onChange={handleTitleChange} />
			<input value={url} onChange={handleUrlChange} />
			<button className="disabled:bg-gray-200" onClick={handleSubmit} disabled={disableButton()}>submit</button>
		</div>
	</>
	)

}

export default ProposeAddUrlTopic;
