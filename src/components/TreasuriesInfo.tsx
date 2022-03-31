import { web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";
import { ITreasury } from "../model";
import { url }  from "../constants";

type TreasuriesInfoProps = {
	accounts: { publicKey: PublicKey, lamports: number, data: ITreasury }[]
};

const TreasuriesInfo: FC<TreasuriesInfoProps> = ({ accounts }) => {
	
	const [rentExemption, setRentExemption] = useState<number>(0);

	useEffect(()=>{

		const treasuryDataLoad = 8 + 32 + 32 + 4 + 32 + 1;		
		const connection = new web3.Connection(url);

		const get = async () => {
			const amount = await connection.getMinimumBalanceForRentExemption(treasuryDataLoad);
			setRentExemption(amount);
		};
		get();
	},[]);

	let treasuryAccounts = accounts.map((a) => {
		return(
			<tr>
				<td className="p-2 border border-gray-800">{a.data.name}</td>
				<td className="px-3 border border-gray-800 text-center">{a.lamports - rentExemption}</td>
			</tr>
		)
	});

	return (
		<div>
			<h1 className="font-semibold text-xl mb-2">Treasuries Info</h1>
			<div className="flex justify-center">
			<table className="text-left border border-collapse border-gray-800">
				<tr>
					<th className="p-2 border-b-2 border-gray-800">name</th>
					<th className="px-3 border-l border-b-2 border-gray-800">amount (lamports)</th>
				</tr>
				{treasuryAccounts}
			</table>
			</div>
			<div className="text-xs mt-2">
			(1 SOL = 10^9 lamports)
			</div>
		</div>
	)
};


export default TreasuriesInfo;
