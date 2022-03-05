import { PublicKey } from '@solana/web3.js';
import { FC, useEffect, useState } from 'react';
import { fetchMultisig, fetchTransactions } from '../fetch';
import { ITransaction } from '../model';
import SingleTransactionItem from './SingleTransactionItem';

type TransactionListProps = {
	multisig: PublicKey
}

const TransactionList: FC<TransactionListProps> = ({ multisig }) => {
	const [txs, setTxs] = useState<{publicKey: PublicKey, data:ITransaction}[]>([]);

	useEffect(() => {
		const getData = async () => {
			
			const [txsAccounts, multisigAccount] = await Promise.all([fetchTransactions(multisig), fetchMultisig(multisig)]);
			
			const transactions = txsAccounts
			.filter(({data})=>{ // filter with the same
				return data.ownerSetSeqno === multisigAccount.data.ownerSetSeqno
			});
			// .filter(({data})=>{
			// 	return !data.didExecute
			// });

			setTxs(transactions);
		};

		getData();
	}, [multisig]);


	const showTransactions = (txs: {publicKey: PublicKey, data: ITransaction}[]) => {
		const list = txs.map(({publicKey, data})=>{
			return(
					<SingleTransactionItem 
					key={publicKey.toBase58()} 
					publicKey={publicKey} 
					data={data} />
			)
		})
		return list
	}


	if (txs.length === 0) {
	return (
		<div>
			TransactionList
		</div>
	)} else {
		return(
			<div>
				{showTransactions(txs)}
			</div>
		)
	}
}

export default TransactionList;
