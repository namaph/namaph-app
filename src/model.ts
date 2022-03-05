import { PublicKey } from '@solana/web3.js';
import { BN, Idl, Program } from '@project-serum/anchor';

export interface IContextPrograms {
	appState: AppState
}

export enum AppState {
	Disconnected,  //eslint-disable-line
	WalletConnected, //eslint-disable-line
	Member //eslint-disable-line
}

export interface ITransactionAccount {
	pubkey: PublicKey,
	isWritable: boolean,
	isSigner: boolean
}

export interface IUpdateTopologyData {
	id: number,
	value: number,
}

export interface IPrograms {
	namaph: Program<Idl>,
	multisig: Program<Idl>
}

export interface IMultisigTransaction {
	proposer: PublicKey, // Membership
	multisig: PublicKey,
	programs: IPrograms
}

export interface ITopology {
	authority: PublicKey,
	multisig: PublicKey,
	mapName: string,
	capacity: number,
	values: Uint8Array,
	bump: number
}

export interface IMembership {
	username: string,
	wallet: PublicKey,
	bump: number,
}

export interface IMultisig {
	nonce: number,
	ownerSetSeqno: 0,
	owners: PublicKey[],
	threshold: BN
}

export interface ITreasury {
	multisig: PublicKey,
	name: string,
	bump: number,
}

export interface ITransaction {
	multisig: PublicKey,
	ownerSetSeqno: number,
	data: Uint8Array,
	didExecute: boolean,
	accounts: ITransactionAccount[],
	programId: PublicKey,
	signers: boolean[]
}
