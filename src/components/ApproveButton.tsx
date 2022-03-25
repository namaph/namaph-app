import { FC, useEffect, useState } from "react"
import { connection, namaphProgram } from "../constants";
import { PublicKey } from '@solana/web3.js';
import { fetchMultisig } from "../fetch";
import { approve } from '../rpc';
import { Idl, Provider, Wallet, Program } from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import nIdl from '../idl/namaph_multisig.json';
import mIdl from '../idl/serum_multisig.json';

type ApproveButtonProps = {
	user: PublicKey,
	multisig: PublicKey,
	transaction: PublicKey,
	txSigners: boolean[]
}

const ApproveButton: FC<ApproveButtonProps> = ({ user, multisig, transaction, txSigners }) => {

	const [alreadyApproved, setAlreadyApproved] = useState(true);
	const [membership, setMembership] = useState<PublicKey | undefined>(undefined);
	const wallet = useAnchorWallet();

	useEffect(() => {
		const getData = async () => {
			const [[membership], multisigAccount] = await Promise.all(
				[
					PublicKey.findProgramAddress(
						[Buffer.from('membership'), multisig.toBytes(), user.toBytes()], namaphProgram),
					fetchMultisig(multisig)

				]);

			setMembership(membership);

			let ownersIndex = -1;
			for (let i = 0; i < multisigAccount.data.owners.length; i++) {
				if (multisigAccount.data.owners[i].toBase58() === membership.toBase58()) {
					ownersIndex = i;
				}
			}

			if (ownersIndex > -1) {
				setAlreadyApproved(txSigners[ownersIndex]);
			}
		}
		getData();
	}, [multisig, txSigners, user]);

	const click = async () => {
		const commitment = 'processed';
		const provider = new Provider(connection, wallet as Wallet, { preflightCommitment: commitment, commitment });
		const namaphProgram = new Program(nIdl as Idl, nIdl.metadata.address, provider);
		const multisigProgram = new Program(mIdl as Idl, mIdl.metadata.address, provider);
		const programs = { namaph: namaphProgram, multisig: multisigProgram };
		setAlreadyApproved(true);
		await approve(programs, multisig, transaction, membership!);
	}

	if(alreadyApproved){
		return(<div> you already approved </div>)
	} else {
	return (
		<>
		<button onClick={click} className="p-3 bg-white border border-4 border-gray-800 font-semibold hover:bg-gray-500 hover:text-gray-100 hover:border-gray-500 active:bg-gray-800 active:border-gray-800 active:text-gray-100 disabled:bg-gray-200 disabled:text-gray-400 rounded-full" disabled={alreadyApproved}> approve </button>
		</>
	)
	}
}

export default ApproveButton
