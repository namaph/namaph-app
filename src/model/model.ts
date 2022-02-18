import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";

export interface IAccount {
	publicKey: PublicKey,
	data: IRegistry | IMembership | IMultisig | ITransaction
}

export interface IRegistry {
	multisig: PublicKey,
	name: string,
	topImageTxid: string,
	cellSize: number,
	types: Buffer
}

export interface IMembership {
	user: PublicKey,
	bump: number
}

export interface IMultisig {
    owners: string[], //publicKey
    threshold: BN,
    nonce: number,
    ownerSetSeqno: number,
}

export interface ITransaction {
    multisig: PublicKey,
    program_id: PublicKey,
    accounts: ITransactionAccount[],
    data: Buffer,
    signers: boolean[],
    didExecute: boolean,
    ownerSetSeqno: number,
}

export interface ITransactionAccount {
	pubkey: PublicKey,
	isSigner: boolean,
	isWritable: boolean
}
