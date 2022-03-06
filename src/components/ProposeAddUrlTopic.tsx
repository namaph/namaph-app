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
		<div className="flex flex-col max-w-lg mb-10 space-y-5">
			<div>
				<div className="font-semibold">Url Topic:</div>
				<p>An url can be a Pull Request, a RFC, or whatever url that needs approval as this group.</p>
			</div>
			<div className="text-xl flex flex-col space-y-5">
			<div>
				<div className="flex flex-row space-x-2 items-center">
				<span>title: </span> <input className="py-3 px-5 w-2/3" value={title} onChange={handleTitleChange} />
				</div>
			</div>
			<div className="flex flex-row space-x-2 items-center">
				<span>url: </span><input className="py-2 px-3" value={url} onChange={handleUrlChange} />
			</div>
			</div>
			<button onClick={handleSubmit} disabled={disableButton()} className="p-3 bg-white border border-4 border-gray-800 font-semibold hover:bg-gray-500 hover:text-gray-100 hover:border-gray-500 active:bg-gray-800 active:border-gray-800 active:text-gray-100 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400 rounded-full"> submit </button>

		</div>
	</>
	)

}

export default ProposeAddUrlTopic;
