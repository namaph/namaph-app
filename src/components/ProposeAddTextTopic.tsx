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
		<div className="flex flex-col max-w-lg mb-10 space-y-5">
			<div>
				<div className="font-semibold">Plain Text Topic:</div>
				<p className="bg-yellow-300 p-3 my-2" >Attention! Currently we have a known issue when posting longer topics. Refer to <a className="font-semibold underline" href="https://github.com/namaph/namaph-app/issues/1">this</a> issue.</p>
			</div>
			<div className="text-xl flex flex-col space-y-5">
			<div>
				<div className="flex flex-row space-x-2 items-center">
				<span>title: </span> <input className="py-3 px-5 text-center w-2/3" value={title} onChange={handleTitleChange} />
				</div>
			</div>
			<div className="flex flex-row space-x-2 items-center">
				<textarea className="py-2 px-3 w-full h-40" value={body} onChange={handleBodyChange} />
			</div>
			</div>
			<button onClick={handleSubmit} disabled={disableButton()} className="p-3 bg-white border border-4 border-gray-800 font-semibold hover:bg-gray-500 hover:text-gray-100 hover:border-gray-500 active:bg-gray-800 active:border-gray-800 active:text-gray-100 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400 rounded-full"> submit </button>

		</div>
	</>
	)
}

export default ProposeAddTextTopic;
