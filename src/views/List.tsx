import React, { useEffect, useState, useContext } from 'react';
import { RouteComponentProps } from "@reach/router";
import { WorkspaceContext } from '../App';
import { fetchTransactions } from '../api/fetch';
import ShowTransactions from '../components/ShowTransactions';


const List = (props: RouteComponentProps) => {
	let { multisigProgram } = useContext(WorkspaceContext);
	let [transactions, setTransactions] = useState<null | any[]>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (multisigProgram) {
				const reg = await fetchTransactions(multisigProgram);
				setTransactions(reg);
			}
		}
		fetchData();
	}, [multisigProgram])

	return (
		<div>
			<div className="py-3 font-semibold">Transaction List:</div>
			<ShowTransactions txs={transactions} />
		</div>
	)
};

export default List;
