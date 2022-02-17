import React from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Provider, Program, Wallet, Idl } from '@project-serum/anchor';
// import idl from '../../../target/idl/tiny_dao.json';
import shardIdl from '../../shard/target/idl/shard.json';
import multisigIdl from '../../shard/target/idl/serum_multisig.json';

export interface IContextPrograms {
	shardProgram: null|Program<Idl>,
	multisigProgram: null|Program<Idl>
}

export const WorkspaceContext = React.createContext({
	shardProgram: null,
	multisigProgram: null
} as IContextPrograms);

export const initWorkspace = (): IContextPrograms => {

	const preflightCommitment = 'processed';
	const commitment = 'processed';
	const shardID = new PublicKey(shardIdl.metadata.address);
	const multisigId = new PublicKey(multisigIdl.metadata.address);

	const wallet = useAnchorWallet() as Wallet;
	// const wallet = useWallet();
	const connection = new Connection('https://api.devnet.solana.com', commitment);
	// const connection = new Connection('http://127.0.0.1:8899', commitment);
	const provider = new Provider(connection, wallet, { preflightCommitment, commitment });
	const shardProgram = new Program(shardIdl as Idl, shardID, provider);
	const multisigProgram = new Program(multisigIdl as Idl, multisigId, provider);

	return { shardProgram, multisigProgram }
}

