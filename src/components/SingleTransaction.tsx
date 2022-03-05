import { FC } from 'react';
import { PublicKey } from '@solana/web3.js';
import { ITransaction } from '../model';


type SingleTransactionItemProps = {
	publicKey: PublicKey,
	data: ITransaction
}

const SingleTransactionItem: FC<SingleTransactionItemProps> = ({ publicKey, data }) => {
	return (<div>
		hello
	</div>)
};

export default SingleTransactionItem;

