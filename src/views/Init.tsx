import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from "@reach/router";
import { WorkspaceContext } from "../App";
import { createMember, initMultisig, createTx } from "../api/common";
import { IRegistry, ITransactionAccount } from '../model/model';
import { PublicKey } from '@solana/web3.js';
import { multisigPubkey, multisigSignerPubkey as multisigSigner, registryPubkey } from '../constants';
//import BN from 'bn.js';
import { Idl, Program } from '@project-serum/anchor';

const Init = (props: RouteComponentProps) => {

	const { shardProgram, multisigProgram, wallet } = React.useContext(WorkspaceContext);
	const [registry, setRegistry] = useState<null | IRegistry>(null);

	useEffect(() => {
		if (shardProgram && multisigProgram && wallet) {
			const getRegistry = async () => {
				let registryList = await shardProgram.account.registry.all();
				console.log(registryList);
				setRegistry(registryList[0].account as IRegistry);
			};

			getRegistry();
		}
	}, [wallet, shardProgram, multisigProgram]);

	console.log(registry?.multisig.toBase58());


	const initRegistry = async () => {

		if (wallet && shardProgram && multisigProgram) {
			const name = "shard";
			try {
				await initMultisig(shardProgram, multisigProgram, name, wallet.publicKey);
			} catch (e) {
				console.log(e);
			}
		}
	}

	const createMembership = async () => {
		if (wallet && shardProgram) {
			// create a membership
			const result = await createMember(shardProgram, wallet.publicKey, wallet.publicKey);
			console.log('membership:', result.membership.publicKey.toBase58());
		}
	}

const createTransaction = async () => {
	if (multisigProgram && shardProgram) {

		const membership = new PublicKey('G8eD2CksgFwozGFpCs1fPNrQLYijBins3H36WK9rGM5e');

		const data = shardProgram.coder.instruction.encode("change_cell_type", {
			idLoc: 0,
			idType: 4
		});

		const accounts = shardProgram.instruction.changeCellType.accounts({
			registry: registryPubkey,
			multisig: multisigPubkey,
			multisigSigner,
		});

		const pid = shardProgram.programId;

		await createTx(shardProgram, multisigProgram, multisigPubkey, membership, pid, accounts, data, 1000);

	}
}

/*
	const createTransaction = async () => {

		if (multisigProgram && shardProgram) {

			const membership = new PublicKey('G8eD2CksgFwozGFpCs1fPNrQLYijBins3H36WK9rGM5e');

			const newOwners = [
				new PublicKey('G8eD2CksgFwozGFpCs1fPNrQLYijBins3H36WK9rGM5e'),
				membership,
			];

			let data = multisigProgram.coder.instruction.encode("set_owners", {
				owners: newOwners,
				// threshold: new BN(2)
			});

			let accounts = multisigProgram.instruction.setOwners.accounts({
				multisig: multisigPubkey,
				multisigSigner
			}) as ITransactionAccount[];

			let pid = multisigProgram.programId;
			let txSize = 1000; // TODO: reason this

			//llet transaction = await createTx(shardProgram, multisigProgram, multisigPubkey, membership, pid, accounts, data, txSize);

			await createTx(shardProgram, multisigProgram, multisigPubkey, membership, pid, accounts, data, txSize);

		//	let remainingAccounts = convertToRemainingAccounts(accounts, multisigSigner, multisigProgram);
		//
			// await multisigProgram.rpc.executeTransaction({
			// 	accounts: {
			// 		multisig: multisigPubkey,
			// 		multisigSigner,
			// 		transaction: transaction.publicKey
			// 	},
			// 	remainingAccounts
			// })


		}
	}

	*/



return (
	<div>
		<div>
			{registry && registry.name}
		</div>
		<button className="bg-pink-100 m-3" onClick={initRegistry}>initiate registry</button>
		<button className="bg-pink-100 m-3" onClick={createMembership}>createMember</button>
		<button className="bg-pink-100 m-3" onClick={createTransaction}>createTransaction</button>
	</div>)
}

// modifies the account list for the 'transaction to be executed'
// we don't want to verify signature when we send it from the client,
// the program will flip the flag when processing.
// we also want to add the program last in the list.
export const convertToRemainingAccounts = (accounts: ITransactionAccount[], signer: PublicKey, program: Program<Idl>) => {
	return accounts.map((account) => {
		if (account.pubkey.equals(signer)) {
			return { ...account, isSigner: false }
		} else {
			return account
		}
	}).concat({
		pubkey: program.programId,
		isWritable: false,
		isSigner: false,
	});
}


export default Init;
