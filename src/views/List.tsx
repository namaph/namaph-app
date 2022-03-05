import { useEffect, useState } from 'react';
import { RouteComponentProps } from "@reach/router";
import TransactionList from '../components/TransactionList';
import { fetchTopology } from '../fetch';
import { projectName } from '../constants';
import { PublicKey } from '@solana/web3.js';

const List = (props: RouteComponentProps) => {

	const [multisig, setMultisig] = useState<null | PublicKey>(null);

	useEffect(() => {
		const getData = async () => {
			const topologyAccount = await fetchTopology(projectName);
			setMultisig(topologyAccount.data.multisig);
		}
		getData();
	}, [])


	if (multisig) {
		return (
			<div>
				List of Transactions:
				<TransactionList multisig={multisig} />
			</div>)
	} else {
		return (
			<div>
				Loading Transaction List
			</div>)
	}
};

export default List;
