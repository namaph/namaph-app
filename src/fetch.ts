import { PublicKey } from '@solana/web3.js';
import { namaphProgram, namaphACoder, connection, multisigACoder, multisigProgram, projectName } from './constants';
import { IMembership, IMultisig, ITextTopic, ITopology, ITransaction, ITreasury, IUrlTopic } from './model';

export const fetchTopology = async (mapName: String):
	Promise<{ publicKey: PublicKey, data: ITopology }> => {

	const [publicKey] = await PublicKey.findProgramAddress(
		[Buffer.from('topology'), Buffer.from(mapName.slice(0, 32))],
		namaphProgram);

	const info = await connection.getAccountInfo(publicKey);

	if (!info) {
		throw new Error(`Account does not exist ${publicKey.toBase58()}`);
	}

	const data = namaphACoder.decode('Topology', info.data) as ITopology;

	return { publicKey, data }
}

export const fetchTextTopic = async (textTopic: PublicKey):
	Promise<{ publicKey: PublicKey, data: ITextTopic }> => {

	const info = await connection.getAccountInfo(textTopic);

	if (!info) {
		throw new Error(`Account does not exist ${textTopic.toBase58()}`);
	}

	const data = namaphACoder.decode('TextTopic', info.data) as ITextTopic;

	return { publicKey: textTopic, data }
}

export const fetchUrlTopic = async (urlTopic: PublicKey):
	Promise<{ publicKey: PublicKey, data: IUrlTopic }> => {

	const info = await connection.getAccountInfo(urlTopic);

	if (!info) {
		throw new Error(`Account does not exist ${urlTopic.toBase58()}`);
	}

	const data = namaphACoder.decode('UrlTopic', info.data) as IUrlTopic;

	return { publicKey: urlTopic, data }
}

export const fetchTreasury = async (multisig: PublicKey): Promise<{
	lamports: number, publicKey: PublicKey, data: ITreasury
}[]> => {
	const memcmp = namaphACoder.memcmp('Treasury');
	const infos = await connection.getProgramAccounts(
		namaphProgram,
		{
			commitment: 'processed',
			filters: [
				{ memcmp },
				{
					memcmp: {
						offset: 8,
						bytes: multisig.toBase58()
					}
				}
			]
		}
	);
	return infos.map(({ pubkey, account }) => {
		return ({
			lamports: account.lamports,
			publicKey: pubkey as PublicKey,
			data: namaphACoder.decode('Treasury', account.data)
		})
	});
}

export const fetchTransactions = async (multisig: PublicKey) => {
	const memcmp = multisigACoder.memcmp('Transaction');
	const infos = await connection.getProgramAccounts(
		multisigProgram,
		{
			commitment: 'processed',
			filters: [
				{ memcmp },
				{
					memcmp: {
						offset: 8,
						bytes: multisig.toBase58()
					}
				}
			]
		}
	);
	return infos.map(({ pubkey, account }) => {
		return ({
			publicKey: pubkey as PublicKey,
			data: multisigACoder.decode('Transaction', account.data) as ITransaction
		})
	});
}

export const fetchTransaction = async (transaction: PublicKey) => {
	const info = await connection.getAccountInfo(transaction);

	if (!info) {
		throw new Error(`Transaction Account doesn't exist ${transaction.toBase58()}`);
	}

	const data = multisigACoder.decode('Transaction', info.data) as ITransaction;

	return { publicKey: transaction, data };
}

export const fetchMembership = async (userAddress: PublicKey): Promise<{
	publicKey: PublicKey, data: IMembership
}> => {


	const topologyAccount = await fetchTopology(projectName);

	const [publicKey] = await PublicKey.findProgramAddress(
		[Buffer.from('membership'), topologyAccount.data.multisig.toBytes(), userAddress.toBytes()],
		namaphProgram)

	const info = await connection.getAccountInfo(publicKey);

	if (!info) {
		throw new Error(`Account doesn not exist ${publicKey.toBase58}`);
	}

	const data = namaphACoder.decode('Membership', info.data) as IMembership;

	return { publicKey, data }
}

export const fetchMultisig = async (address: PublicKey): Promise<{ publicKey: PublicKey, data: IMultisig }> => {

	const info = await connection.getAccountInfo(address);

	if (!info) {
		throw new Error(`Account doesn not exist ${address.toBase58()}`);
	}

	const data = multisigACoder.decode('Multisig', info.data) as IMultisig;

	return { publicKey: address, data }
}

export const checkIfMember = async (mapName: string, address: PublicKey): Promise<boolean> => {
	const topologyAccount = await fetchTopology(mapName);

	const [membership] = await PublicKey.findProgramAddress(
		[Buffer.from('membership'), topologyAccount.data.multisig.toBytes(), address.toBytes()],
		namaphProgram);


	const multisigAccount = await fetchMultisig(topologyAccount.data.multisig);

	return multisigAccount.data.owners
		.map(m => m.toBase58())
		.includes(membership.toBase58())
}

