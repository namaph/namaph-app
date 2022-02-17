import React, {useEffect} from 'react';
import { RouteComponentProps } from "@reach/router";
import { WorkspaceContext } from '../workspace';
import { fetchTransactions } from '../api/fetch';

const Home = (props: RouteComponentProps) => {
	const context = React.useContext(WorkspaceContext);
	const mProgram = context.multisigProgram;

	useEffect(()=>{
		
		const fetchTxs = async () => {
			if(mProgram) {
				const txs = await fetchTransactions(mProgram);
				console.log('txs:', txs);
			}
		}	
		fetchTxs();
	},[mProgram])

	return (
		<div>
			image
		</div>
	)
};

export default Home;
