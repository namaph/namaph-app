import { PublicKey } from "@solana/web3.js";
import { FC } from "react";
import { ITransaction, IMultisig } from "../model";

type TransactionsInfoProps = {
	accounts: { publicKey: PublicKey, data: ITransaction }[]
	multisigData: IMultisig
};

const TransactionsInfo: FC<TransactionsInfoProps> = ({ accounts, multisigData }) => {
	let current = 0;
	let executed = 0;
	// get current tsx
	for (let i = 0; i < accounts.length; i++) {
		if (accounts[i].data.didExecute) {
			executed++;
		} else {
			if (accounts[i].data.ownerSetSeqno === multisigData.ownerSetSeqno) {
				current++;
			}
		}
	}

	return (
		<div>
			<h1 className="font-semibold text-xl mb-2">Transactions Info</h1>

			<div className="flex justify-center max-w-lg">
			<table className="table-fixed text-left border border-gray-800 border-collapse">
			<tr className="border-b border-gray-800">
				<th className="p-2">open topics</th>
				<td className="px-3 border-l border-gray-800">{current}</td>
			</tr>
			<tr>
				<th className="p-2">execute</th>
				<td className="px-3 border-l border-gray-800">{executed}</td>
			</tr>
			</table>
			</div>
		</div>
	)
};


export default TransactionsInfo;
