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

		await approve(programs, multisig, transaction, membership!);
	}

	return (
		<>
			<button className="disabled:bg-gray-200" disabled={alreadyApproved} onClick={click} > approve </button>
		</>
	)
}

export default ApproveButton
