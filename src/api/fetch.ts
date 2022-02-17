import {Program, Idl} from '@project-serum/anchor';

export const fetchTransactions = async (multisigProgram:Program<Idl> ) => {
	const transactions = await multisigProgram.account.transactions.all();
	console.log(transactions);
}
