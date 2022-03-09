import { PublicKey } from '@solana/web3.js';
import { FC, useEffect, useState } from 'react';
import { fetchMembership } from '../fetch';
import { IMembership } from '../model';
import { displayPubkey } from '../utility';

type MemberListProps = {
	memberships: PublicKey[]
}

type MemberPropos = {
	publicKey: PublicKey,
	data: IMembership,
}

const ShowMember: FC<MemberPropos> = ({publicKey, data}) => {
	return (<div className="flex flex-row space-x-2 items-center" key={`${data.wallet}`}>
		<div className="font-semibold">{data.username}</div><div className="text-xs">({displayPubkey(publicKey)})</div>
	</div>)
}

const MemberList: FC<MemberListProps> = ({ memberships }) => {

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
		return membershipAccounts.map(m => <ShowMember publicKey={m.publicKey} data={m.data}/>)
	}

	return (
		<div>
			{showMemberships()}
		</div>
	)
}

export default MemberList;

