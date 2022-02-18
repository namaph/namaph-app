import { RouteComponentProps } from "@reach/router"
import { useContext, useEffect, useState } from "react"
import { fetchMultisig, fetchRegistry, fetchTransactions, findMultisigSigner, lookUpMembership } from "../api/fetch"
import { WorkspaceContext } from "../App"
import { registryPubkey, multisigPubkey } from "../constants"
import { IMultisig, IMembership, IRegistry } from "../model/model"
import ShowMultisig from "../components/ShowMultisig";
import ShowWallet from "../components/ShowWallet"
import ShowMembership from "../components/ShowMembership"
import { PublicKey } from "@solana/web3.js"
import ShowRegistry from "../components/ShowRegistry"
import ShowTransactions from "../components/ShowTransactions";

const Status = (props: RouteComponentProps) => {

	let { shardProgram, multisigProgram, wallet } = useContext(WorkspaceContext);

	let [multisig, setMultisig] = useState<null | IMultisig>(null);

	let [registry, setRegistry] = useState<null | IRegistry>(null);
	
	let [membership, setMembership] = useState<null | {publicKey:PublicKey, data:IMembership}>(null);
	let [signer, setSigner] = useState<null | PublicKey>(null);

	let [transactions, setTransactions] = useState<null | any[]>(null);
	

	useEffect(() => {
		const fetchData = async () => {
			if (multisigProgram) {
				const m = await fetchMultisig(multisigPubkey, multisigProgram);
				setMultisig(m);

				const txs = await fetchTransactions(multisigProgram);
				setTransactions(txs);
				
				const sign = await findMultisigSigner(multisigPubkey, multisigProgram);
				setSigner(sign);
			}

			if (shardProgram && wallet) {
				const m = await lookUpMembership(wallet.publicKey, shardProgram);
				setMembership(m)
			}

			if (shardProgram) {
				const reg = await fetchRegistry(registryPubkey, shardProgram);
				setRegistry(reg);
			}

		};
		fetchData();
	}, [multisigProgram, shardProgram, wallet])

	return (
		<>
			<h1>Status</h1>
			<div>
				<ShowRegistry pubkey={registryPubkey} registry={registry}/>
				<ShowMembership membershipInfo={membership}/>
				<ShowWallet wallet={wallet}/>
				<ShowMultisig pubkey={multisigPubkey} multisig={multisig} /> {signer && <div>signer: {signer.toBase58()}</div>} 
				<ShowTransactions txs={transactions} />
			</div>
		</>
	)
}

export default Status
