import { useContext, useEffect, useState } from "react"
import { findMembership } from "../api/fetch"
import { WorkspaceContext } from "../App"
import { multisigPubkey } from "../constants"
import { PublicKey } from "@solana/web3.js"
import { approve } from "../api/common"


interface IApproveButtonProps {
	transaction: PublicKey,
}

const ApproveButton = (props: IApproveButtonProps) => {

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
			await approve(shardProgram, multisigPubkey, props.transaction, membership, multisigProgram);
		}
	
};

return <button className="align-right float-right bg-green-200 p-3 m-2 font-semibold hover:bg-green-500 hover:text-green-100 rounded-full" onClick={onClick}>approve</button>
}

export default ApproveButton
