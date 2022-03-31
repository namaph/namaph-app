import { useEffect, useState } from 'react';
import { RouteComponentProps } from "@reach/router";
import TransactionList from '../components/TransactionList';
import { fetchTopology } from '../fetch';
import { projectName } from '../constants';
import { PublicKey } from '@solana/web3.js';
import { ITopology } from '../model';

const List = (props: RouteComponentProps) => {

	const [multisig, setMultisig] = useState<null | PublicKey>(null);
	const [topologyData, setToplogyData] = useState<null | ITopology>(null);

	useEffect(() => {
		const getData = async () => {
			const topologyAccount = await fetchTopology(projectName);
			setToplogyData(topologyAccount.data);
			setMultisig(topologyAccount.data.multisig);
		}
		getData();
	}, [])


	if (multisig && topologyData) {
		return (
			<div>
				<TransactionList multisig={multisig} topologyData={topologyData}/>
			</div>)
	} else {
		return (
			<div>
				Loading Transaction List
			</div>)
	}
};

export default List;
