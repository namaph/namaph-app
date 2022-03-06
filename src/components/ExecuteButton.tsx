import { FC } from 'react';
import { PublicKey } from '@solana/web3.js';
import { fetchTopology, fetchTransaction } from '../fetch';
import { execute } from '../rpc';
import { ITransactionAccount } from '../model';
import { connection, multisigProgram, projectName } from '../constants';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Idl, Program, Provider, Wallet } from '@project-serum/anchor';
import mIdl from '../idl/serum_multisig.json';


type ExecuteButtonProps = {
	transaction: PublicKey
}

const ExecuteButton: FC<ExecuteButtonProps> = ({ transaction }) => {
	const wallet = useAnchorWallet()

	// fetch the transaction	
	const click = async () => {
		const account = await fetchTransaction(transaction)

		const accounts = account.data.accounts as ITransactionAccount[];
		const pid = account.data.programId;

		const commitment = 'processed';
		const provider = new Provider(connection, wallet as Wallet, { preflightCommitment: commitment, commitment });
		const program = new Program(mIdl as Idl, mIdl.metadata.address, provider);
		const topology = await fetchTopology(projectName);
		const [signer] = await PublicKey.findProgramAddress([topology.data.multisig.toBuffer()], program.programId);

		console.log('(button)multisigProgram', multisigProgram.toBase58());
		console.log('(button)multisig', topology.data.multisig.toBase58());
		console.log('results to');
		console.log('(button)signer', signer.toBase58());

		await execute(
		accounts, 
		topology.data.multisig,
		signer, 
		transaction, 
		pid, 
		program);
	};


	return (
		<button onClick={click} className="p-3 bg-white border border-4 border-gray-800 font-semibold hover:bg-gray-500 hover:text-gray-100 hover:border-gray-500 active:bg-gray-800 active:border-gray-800 active:text-gray-100 disabled:bg-gray-200 disabled:text-gray-400 rounded-full"> execute </button>
	)
}

export default ExecuteButton
