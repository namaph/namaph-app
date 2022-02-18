import { Program, Idl } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { IMembership, IMultisig, IRegistry } from '../model/model';

export const fetchRegistry = async (pubKey: PublicKey, program: Program<Idl>): Promise<IRegistry> => {
	return await program.account.registry.fetch(pubKey) as IRegistry;
}

export const fetchRegistryAll = async (program: Program<Idl>) => {
	return await program.account.registry.all();
}

export const findMembership = async (pubkey:PublicKey, program: Program<Idl>): Promise<PublicKey> => {
	const [membership] = await PublicKey.findProgramAddress([Buffer.from('membership'), pubkey.toBytes()], program.programId);

	return membership
}

export const findMultisigSigner = async (pubkey:PublicKey, program: Program<Idl>): Promise<PublicKey> => {
	
	const [multisigSigner] = await PublicKey.findProgramAddress([pubkey.toBytes()], program.programId);

	return multisigSigner
}

export const fetchMembership = async (pubKey: PublicKey, program: Program<Idl>): Promise<IMembership> => {
	return await program.account.membership.fetch(pubKey) as IMembership
}

export const lookUpMembership = async (user: PublicKey, program: Program<Idl>) => {
	
	const publicKey = await findMembership(user, program);
	const data = await fetchMembership(publicKey, program) as IMembership;

	return {publicKey, data}
}

export const fetchMultisig = async (pubKey: PublicKey, program: Program<Idl>): Promise<IMultisig> => {
	return await program.account.multisig.fetch(pubKey) as IMultisig
}

export const fetchTransactions = async (program: Program<Idl>) => {
	let txs = await program.account.transaction.all()

	return txs
}

