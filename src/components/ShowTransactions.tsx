import { PublicKey } from "@solana/web3.js";
import { ITransaction } from "../model/model";
import ShowTransaction from "./ShowTransaction";

interface IFetchResult {
	account: ITransaction,
	publicKey: PublicKey
}

interface ITransactionProps {
	txs: IFetchResult[] | null,
}

const ShowTransactions = (props: ITransactionProps) => {
	if (props.txs) {
		let transactions = [];
		for (let i in props.txs) {
			transactions.push(<ShowTransaction key={props.txs[i].publicKey.toBase58()} publicKey={props.txs[i].publicKey} data={props.txs[i].account} />);
		}
		return (<div>{transactions}</div>)

	} else {
		return (<div>Transactions Loading</div>)
	}
}


export default ShowTransactions;
