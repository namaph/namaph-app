import { useContext, useEffect, useState } from "react"
import { findMembership } from "../api/fetch"
import { WorkspaceContext } from "../App"
import { multisigPubkey, multisigSignerPubkey as multisigSigner, registryPubkey } from "../constants"
import { PublicKey } from "@solana/web3.js"
import { convertToRemainingAccounts } from "../api/common"
import { ITransactionAccount } from '../model/model';


interface IExecuteButtonProps {
	transaction: PublicKey,
}

const ExecuteButton = (props: IExecuteButtonProps) => {

	let { shardProgram, multisigProgram, wallet } = useContext(WorkspaceContext);

	let [membership, setMembership] = useState<null | PublicKey>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (shardProgram && wallet) {
				const m = await findMembership(wallet.publicKey, shardProgram);
				setMembership(m);
			}
		}

		fetchData();
	}, [shardProgram, wallet])


	const onClick = async () => {
		if (multisigProgram && membership && shardProgram) {
			// await execute(shardProgram, multisigPubkey, props.transaction, membership, multisigProgram);
			const accounts = shardProgram.instruction.changeCellType.accounts({
				registry: registryPubkey,
				multisig: multisigPubkey,
				multisigSigner,
			}) as ITransactionAccount[];

			const remainingAccounts = convertToRemainingAccounts(accounts, multisigSigner, shardProgram);

		await multisigProgram.rpc.executeTransaction({
			accounts: {
				multisig: multisigPubkey,
				multisigSigner,
				transaction: props.transaction,
			},
			remainingAccounts
		});


		}

	};

	return <button className="align-right float-right bg-green-200 p-3 m-2 font-semibold hover:bg-green-500 hover:text-green-100 rounded-full" onClick={onClick}>execute</button>
}

export default ExecuteButton
