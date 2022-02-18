import * as anchor from '@project-serum/anchor';
import { Program, Idl } from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const systemProgram = anchor.web3.SystemProgram.programId;

export const createUser = async (program: Program<Idl>) => {

	const connection = program.provider.connection;

	let user = Keypair.generate();
	let ad = await connection.requestAirdrop(user.publicKey, 10 * LAMPORTS_PER_SOL);

	await connection.confirmTransaction(ad);

	return user
}


export const createMember = async (program: Program<Idl>, payer: PublicKey, user?: PublicKey) => {

	if (user == undefined) {
		user = Keypair.generate().publicKey;
	}

	const [membership, bump] = await PublicKey.findProgramAddress(
		[Buffer.from("membership"), user.toBytes()],
		program.programId);

	await program.rpc.createMember(user, {
		accounts: {
			membership,
			payer: payer,
			systemProgram
		},
		signers: []
	});


	return {
		membership: { publicKey: membership, bump },
		user
	}
}

export const initMultisig = async (shard: Program<Idl>, multisigProgram: Program<Idl>, name: string, payer: PublicKey) => {

	const multisig = Keypair.generate();
	const registry = Keypair.generate();

	const [membership] = await PublicKey.findProgramAddress(
		[Buffer.from("membership"), payer.toBytes()],
		shard.programId);

	const [multisigSigner, nonce] = await PublicKey.findProgramAddress(
		[multisig.publicKey.toBuffer()],
		multisigProgram.programId);

	const [multisigShardSigner, shardNonce] = await PublicKey.findProgramAddress(
		[multisig.publicKey.toBuffer()],
		shard.programId);

	await shard.rpc.initMultisig(name, payer, nonce, shardNonce, {
		accounts: {
			registry: registry.publicKey,
			multisig: multisig.publicKey,
			membership,
			payer,
			multisigProgram: multisigProgram.programId,
			systemProgram
		},
		signers: [registry, multisig],
		instructions: [
			await multisigProgram.account.multisig.createInstruction(
				multisig,
				200 // TODO: think more about this value
			)
		]
	});

	return {
		membership, multisig, multisigSigner, registry, multisigShardSigner
	}

}

export const createTx = async (shard: Program<Idl>, multisigProgram: Program<Idl>, multisig: PublicKey, proposer: PublicKey, transactionProgramId: PublicKey, transactionAccounts: any, data: Buffer, transactionSize: number) => {

	const transaction = Keypair.generate();

	await shard.rpc.createTransaction(transactionProgramId, transactionAccounts, data, {
		accounts: {
			membership: proposer,
			multisig: multisig,
			transaction: transaction.publicKey,
			multisigProgram: multisigProgram.programId,
			systemProgram
		},
		signers: [transaction],
		instructions: [
			await multisigProgram.account.transaction.createInstruction(
				transaction,
				transactionSize
			)
		]
	});

	return transaction
}

export const approve = async (shard: Program<Idl>, multisig: PublicKey, transaction: PublicKey, membership: PublicKey, multisigProgram: Program<any>) => {
	await shard.rpc.approve({
		accounts: {
			multisig,
			transaction,
			membership,
			multisigProgram: multisigProgram.programId
		}
	});
}


// modifies the account list for the 'transaction to be executed'
// we don't want to verify signature when we send it from the client,
// the program will flip the flag when processing.
// we also want to add the program last in the list.
export const convertToRemainingAccounts = (accounts: any[], signer: PublicKey, program: Program<Idl>) => {
	return accounts.map((account) => {
		if (account.pubkey.equals(signer)) {
			return { ...account, isSigner: false }
		} else {
			return account
		}
	}).concat({
		pubkey: program.programId,
		isWritable: false,
		isSigner: false,
	});
}

