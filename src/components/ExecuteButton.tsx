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
		<button onClick={click} className="bg-gray-200"> execute </button>
	)
}

export default ExecuteButton
