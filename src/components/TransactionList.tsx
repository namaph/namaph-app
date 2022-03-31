import { PublicKey } from '@solana/web3.js';
import { FC, useEffect, useState } from 'react';
import { fetchMultisig, fetchTransactions } from '../fetch';
import { ITransaction, ITopology, IMultisig } from '../model';
import SingleTransactionItem from './SingleTransactionItem';
import { getCityIoNodeLabels } from '../cityio';

type TransactionListProps = {
	multisig: PublicKey,
	topologyData: ITopology,
}

type ITxAccount = { publicKey: PublicKey, data: ITransaction };

const TransactionList: FC<TransactionListProps> = ({ multisig, topologyData }) => {
	const [threshold, setThreshold] = useState<number>(256);
	const [seqNo, setSeqNo] = useState<number>(-1);
	const [aliveTxs, setAliveTxs] = useState<ITxAccount[]>([]);
	const [staleTxs, setStaleTxs] = useState<ITxAccount[]>([]);
	const [executedTxs, setExecutedTxs] = useState<ITxAccount[]>([]);
	const [multisigData, setMultisigData] = useState<null | IMultisig>(null);
	const [nodeLabels, setNodeLabels] = useState<string[]>([]);

	useEffect(() => {
		const getData = async () => {

			const [txsAccounts, multisigAccount] = await Promise.all([fetchTransactions(multisig), fetchMultisig(multisig)]);

			setMultisigData(multisigAccount.data);

			setThreshold(multisigAccount.data.threshold.toNumber());
			setSeqNo(multisigAccount.data.ownerSetSeqno);

			let alive: ITxAccount[] = [];
			let stale: ITxAccount[] = [];
			let executed: ITxAccount[] = [];

			const labels = await getCityIoNodeLabels();
			setNodeLabels(labels);

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
						data={data}
						threshold={threshold}
						seqNo={seqNo}
						multisig={multisigData!}
						topology={topologyData}
						nodeLabels={nodeLabels}
					/>
				</div>
			)
		})
		return <div className="flex flex-col space-y-4"> {list} </div>
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
					data={data} 
					threshold={threshold}
					seqNo={seqNo}
					multisig={multisigData!}
					topology={topologyData}
					nodeLabels={nodeLabels}
					/>
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
						data={data}
						threshold={threshold}
						seqNo={seqNo}
						multisig={multisigData!}
						topology={topologyData}
						nodeLabels={nodeLabels}
						/>
				</div>
			)
		})
		return <div className="flex flex-col space-y-4"> {list} </div>
	}

	if(multisigData){
	return (
		<div>
			<div className="mb-5">
					<h1 className="font-semibold text-xl">
						Current Threshold: <span className="text-red-400">{threshold}</span>
					</h1>
					<p>
						(number of approvals required to be executable)
					</p>
			</div>
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
	} else {
		return <div>loading topics...</div>
	}
}

export default TransactionList;
