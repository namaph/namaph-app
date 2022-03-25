import { PublicKey } from "@solana/web3.js";
import { FC } from "react";
import { ITopology } from "../model";
import { displayPubkey } from "../utility";
import { landTypes, landTypesShort } from "../constants";

type TopologyInfoProps = {
	publicKey: PublicKey,
	simLabels: string[],
	data: ITopology
};

const TopologyInfo: FC<TopologyInfoProps> = ({ publicKey, data, simLabels }) => {

	const legend = landTypesShort.map((s, i) => `${s}:${landTypes[i]} `);

	const table = () => {
		const topoLabels = simLabels.map((l) => <th className="border border-gray-800 p-1 text-xs" key={l}>{l}</th>);
		const values = data.values.map(v=>v+48).toString().split('');
		const topoValues = values.map((v)=> <td className="border border-gray-800 p-1 text-xs">{landTypesShort[parseInt(v)]}</td>);
		return(
		<div className="max-w-lg">
		<table className="border border-collapse border-gray-800 table-auto text-center">
			<tr>
				{topoLabels}
			</tr>
			<tr>
				{topoValues}
			</tr>
		</table>
		</div>)
	}

	return (
		<div>
			<h1 className="font-semibold text-xl mb-2">Topology Info <span className="text-sm font-regular">({displayPubkey(publicKey)})</span></h1>
			<div className="text-sm my-2">
			{legend}
			</div>
			{table()}
			</div>
	)
};

export default TopologyInfo;
