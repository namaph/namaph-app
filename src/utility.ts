import { PublicKey } from '@solana/web3.js';

export const displayPubkey = (key: PublicKey) => {
	const base = key.toBase58();
	return `${base.slice(0,4)}...${base.slice(-4)}`;
}

export const displayUuid = (uid: string) => {
	return uid.slice(0,7);
}
