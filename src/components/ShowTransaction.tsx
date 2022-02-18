import { PublicKey } from "@solana/web3.js";
import { ITransaction } from "../model/model";
import ApproveButton from "../components/ApproveButton";
import ExecuteButton from "../components/ExecuteButton";

interface IFetchResult {
	data: ITransaction,
	publicKey: PublicKey
}

const ShowTransaction = (props: IFetchResult) => {
	
	return (
		<div className="m-1 p-3 w-3/4 bg-green-100 truncate rounded-lg">
			<div className="text-2xl font-semibold my-2">{dataToType(props.data.data[0])}</div>
			<div>publicKey: {shorten(props.publicKey.toBase58())}</div>
			<div>data: {props.data.data}</div>
			<div>didExecute: {props.data.didExecute ? 'yes' : 'no'}</div>
			<div>signers: {approvalRate(props.data.signers)*100}%</div>

			<div><ExecuteButton transaction={props.publicKey}/></div>
			<div><ApproveButton transaction={props.publicKey}/></div>
		</div>
	)
}

const dataToType = (data: number) => {

	switch (data) {
		case 55:
			return "Change owner set and threshold"
		case 12:
			return "Change land use"
		case 159:
			return "Change owner set"
		default:
			return "Unknown transaction"
	}
}

const approvalRate = (signers: boolean[]) => {
	const trueCount = signers
	.reduce((acc, c) => { if(c) {return acc+1} else {return acc} }, 0);

	return trueCount / signers.length
}


const shorten = (str: string) => {
	return str.slice(0, 3) + '...' + str.slice(-4);
}




export default ShowTransaction;
