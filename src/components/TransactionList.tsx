import { PublicKey } from '@solana/web3.js';
import { FC, useEffect, useState } from 'react';
import { fetchMultisig, fetchTransactions } from '../fetch';
import { ITransaction } from '../model';
import SingleTransactionItem from './SingleTransactionItem';

type TransactionListProps = {
	multisig: PublicKey
}

type ITxAccount = { publicKey: PublicKey, data: ITransaction };

const TransactionList: FC<TransactionListProps> = ({ multisig }) => {
	const [aliveTxs, setAliveTxs] = useState<ITxAccount[]>([]);
	const [staleTxs, setStaleTxs] = useState<ITxAccount[]>([]);
	const [executedTxs, setExecutedTxs] = useState<ITxAccount[]>([]);

	useEffect(() => {
		const getData = async () => {

			const [txsAccounts, multisigAccount] = await Promise.all([fetchTransactions(multisig), fetchMultisig(multisig)]);

			let alive: ITxAccount[] = [];
			let stale: ITxAccount[] = [];
			let executed: ITxAccount[] = [];

			txsAccounts.forEach((tx) => {
				if (tx.data.didExecute) {
					executed.push(tx);
				} else if (tx.data.ownerSetSeqno !== multisigAccount.data.ownerSetSeqno) {
					stale.push(tx);
				} else {
					alive.push(tx);
				}
			})

			setAliveTxs(alive);
			setExecutedTxs(executed);
			setStaleTxs(stale);
		};

		getData();
	}, [multisig]);


	const showTransactions = (txs: { publicKey: PublicKey, data: ITransaction }[]) => {

		if (txs.length === 0) {
			return (
				<div className="text-center w-full bg-white py-3 my-2">nothing here...</div>
			)
		}

		const list = txs.map(({ publicKey, data }) => {
			return (
				<div className="bg-white p-3 rounded" key={publicKey.toBase58()} >
				<SingleTransactionItem
					key={publicKey.toBase58()}
					publicKey={publicKey}
					data={data} />
				</div>
			)
		})
		return list
	}

	const showStaleTransactions = (txs: { publicKey: PublicKey, data: ITransaction }[]) => {

		if (txs.length === 0) {
			return (
				<div className="text-center">nothing here...</div>
			)
		}

		const list = txs.map(({ publicKey, data }) => {
			return (
				<SingleTransactionItem
					key={publicKey.toBase58()}
					publicKey={publicKey}
					data={data} />
			)
		})
		return list
	}
	const showExecutedTransactions = (txs: { publicKey: PublicKey, data: ITransaction }[]) => {

		if (txs.length === 0) {
			return (
				<div className="text-center">nothing here...</div>
			)
		}

		const list = txs.map(({ publicKey, data }) => {
			return (
				<div className="bg-gray-300 p-3 rounded" key={publicKey.toBase58()} >
				<SingleTransactionItem
					publicKey={publicKey}
					data={data} />
				</div>
			)
		})
		return <div className="flex flex-col space-y-4"> {list} </div>
	}

	return (
		<div>
			<div className="mb-5">
				<div className="font-semibold">
					Current Topics:
				</div>
				<div>
					{showTransactions(aliveTxs)}
				</div>
			</div>
			<div className="mb-5">
				<div className="font-semibold">
					Past Executed Topics:
				</div>
				<div>
					{showExecutedTransactions(executedTxs)}
				</div>
			</div>
			<div>
				<div className="mb-5">
					<div className="font-semibold">
						Stale Topics:
					</div>
					<div>
						{showStaleTransactions(staleTxs)}
					</div>
				</div>

			</div>
		</div>
	)
}

export default TransactionList;
