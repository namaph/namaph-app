import React, {useEffect} from 'react';
import { RouteComponentProps } from "@reach/router";
import { WorkspaceContext } from '../App';

const Propose = (props: RouteComponentProps) => {
	const context = React.useContext(WorkspaceContext);
	const mProgram = context.multisigProgram;

	useEffect(()=>{
		
		const fetchTxs = async () => {
			if(mProgram) {
				const txs = await mProgram.account.transaction.all();
				console.log(txs);
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

export default Propose;
