import { PublicKey } from '@solana/web3.js';
import { FC, useEffect, useState } from 'react';
import { fetchMembership } from '../fetch';
import { IMembership } from '../model';
import { displayPubkey } from '../utility';
import bs58 from 'bs58'

type MemberListProps = {
	memberships: PublicKey[]
	prefix: string
}

type MemberPropos = {
	publicKey: PublicKey,
	data: IMembership,
}

const ShowMember: FC<MemberPropos> = ({publicKey, data}) => {

	const username = Buffer.from(bs58.decode(data.username)).toString();

	return (<div className="flex flex-row space-x-2 items-center pl-2" key={`${data.wallet}`}>
		<div className="font-semibold italic">{username}</div><div className="text-sm">({displayPubkey(publicKey)})</div>
	</div>)
}

const MemberList: FC<MemberListProps> = ({ memberships, prefix }) => {

	const [membershipAccounts, setMembershipAccounts] = useState<{ publicKey: PublicKey, data: IMembership }[]>([]);

	useEffect(() => {
		const get = async () => {
			if (membershipAccounts.length === 0) {
				const membershipAccounts = await Promise.all(memberships.map(m => fetchMembership(m)));

				setMembershipAccounts(membershipAccounts);

			}
		}

		get();

	}, [membershipAccounts, memberships]);


	const showMemberships = () => {
		return membershipAccounts.map(m => <div className="flex flex-row text-3xl">{prefix} <ShowMember publicKey={m.publicKey} data={m.data}/></div>)
	}

	return (
		<div>
			{showMemberships()}
		</div>
	)
}

export default MemberList;

