import { PublicKey } from "@solana/web3.js";
import { FC } from "react";
import { IMultisig } from "../model";
import { displayPubkey } from "../utility";

type MultisigInfoPropos = {
	publicKey: PublicKey,
	data: IMultisig
};

const MultisigInfo: FC<MultisigInfoPropos> = ({ publicKey, data }) => {
	return (
		<div>
			<h1 className="font-semibold text-xl mb-2">Multisig Info <span className="text-sm font-regular">({displayPubkey(publicKey)})</span></h1>
			<div className="max-w-lg flex justify-center">
			<table className="table-fixed text-left border border-gray-800 border-collapse">
			<tr className="border-b border-gray-800">
				<th className="p-2">number of members</th>
				<td className="px-3 border-l border-gray-800">{data.owners.length}</td>
			</tr>
			<tr>
				<th className="p-2">threshold</th>
				<td className="px-3 border-l border-gray-800">{data.threshold.toString()}</td>
			</tr>
			</table>
			</div>
		</div>
	)
};


export default MultisigInfo;
