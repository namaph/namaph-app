import { PublicKey } from "@solana/web3.js";
import { FC } from "react";
import { IMembership, IMultisig } from "../model";
import { displayPubkey } from "../utility";

type MultisigInfoPropos = {
	publicKey: PublicKey,
	multisig: IMultisig,
	data: IMembership
};

const MembershipInfo: FC<MultisigInfoPropos> = ({ publicKey, data, multisig }) => {
	let memberIndex = 0;
	for (memberIndex = 0; memberIndex < multisig.owners.length; memberIndex++) {
		if (multisig.owners[memberIndex].toBase58() === publicKey.toBase58()) {
			break;
		}
	}

	return (
		<div>
			<h1 className="font-semibold text-xl mb-2">Membership Info</h1>
			<div className="flex max-w-lg justify-center">
			<table className="table-fixed text-left border border-gray-800 border-collapse">
				<tr className="border-b border-gray-800">
					<th className="p-2">id</th>
					<td className="px-3 border-l border-gray-800">{memberIndex}</td>
				</tr>
				<tr className="border-b border-gray-800">
					<th className="p-2">username</th>
					<td className="px-3 border-l border-gray-800">{data.username}</td>
				</tr>
				<tr className="border-b border-gray-800">
					<th className="p-2">wallet address</th>
					<td className="px-3 border-l border-gray-800">{displayPubkey(data.wallet)}</td>
				</tr>
				<tr className="border-b border-gray-800">
					<th className="p-2">membership address</th>
					<td className="px-3 border-l border-gray-800">{displayPubkey(publicKey)}</td>
				</tr>
			</table>
			</div>
			<div className="text-xs mt-2">wallet address should match your wallet's address.</div>
			</div>
	)
};

export default MembershipInfo;
