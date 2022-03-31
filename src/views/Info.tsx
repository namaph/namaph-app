import { PublicKey } from "@solana/web3.js";
import { RouteComponentProps } from "@reach/router";
import { useEffect, useState } from "react";
import { ITreasury, IMultisig, ITopology, IMembership, ITransaction } from "../model";
import MultisigInfo from "../components/MultisigInfo";
import MembershipInfo from "../components/MembershipInfo";
import TopologyInfo from "../components/ToloplogyInfo";
import TransactionsInfo from "../components/TransactionsInfo";
import TreasuriesInfo from "../components/TreasuriesInfo";
import { fetchMembership, fetchMultisig, fetchTopology, fetchTransactions, fetchTreasury } from "../fetch";
import { projectName, namaphProgram } from '../constants';
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getCityIoNodeLabels } from "../cityio";

const Info = (props: RouteComponentProps) => {
	const [topology, setTopology] = useState<{ publicKey: PublicKey, data: ITopology } | undefined>(undefined);

	const [multisig, setMultisig] = useState<undefined | IMultisig>(undefined);
	const [membership, setMembership] = useState<undefined | { publicKey: PublicKey, data: IMembership }>(undefined);

	const [simLabels, setSimLabels] = useState<string[]>([]);
	const [transactions, setTransactions] = useState<{publicKey:PublicKey, data: ITransaction}[]>([]);

	const [treasuries, setTreasuries] = useState<{lamports: number, publicKey: PublicKey, data: ITreasury}[]>([]);

	const wallet = useAnchorWallet();

	useEffect(() => {
		const fetch = async () => {
			if (wallet) {
				const t = await fetchTopology(projectName);
				setTopology(t);
				const m = await fetchMultisig(t.data.multisig);
				setMultisig(m.data);
				const [membership] = await PublicKey.findProgramAddress(
					[
						Buffer.from('membership'),
						t.data.multisig.toBytes(),
						wallet.publicKey.toBytes()
					],
					namaphProgram);
				const membershipAccount = await fetchMembership(membership);
				setMembership(membershipAccount);
				const labels = await getCityIoNodeLabels() as string[];
				setSimLabels(labels);
				const txs = await fetchTransactions(t.data.multisig);
				setTransactions(txs);
				const tres = await fetchTreasury(t.data.multisig);
				setTreasuries(tres);
			}
		}
		fetch();
	}, [wallet]);

	if (topology && multisig && wallet && membership) {
		return (
		<div className="flex max-w-lg flex-col space-y-8">
				<div>general information about this community.</div>
				<div className="bg-white p-5 rounded">
				<MultisigInfo data={multisig} publicKey={topology.publicKey} />
				</div>
				<div className="bg-white p-5 rounded">
				<MembershipInfo multisig={multisig} data={membership.data} publicKey={membership.publicKey} />
				</div>
				<div className="bg-white p-5 rounded">
				<TopologyInfo data={topology.data} simLabels={simLabels} publicKey={topology.publicKey} />
				</div>
				<div className="bg-white p-5 rounded">
				<TransactionsInfo accounts={transactions} multisigData={multisig}/>
				</div>
				<div className="bg-white p-5 rounded">
				<TreasuriesInfo accounts={treasuries}/>
				</div>
		</div>)
	} else {
		return <div>loading info...</div>;
	}
};
export default Info;
