import { PublicKey } from '@solana/web3.js';
import { IMembership } from '../model/model';

interface IShowMembershipProps {
	membershipInfo: {publicKey:PublicKey, data:IMembership} | null,
}

const ShowMembership = (props: IShowMembershipProps) => {

	if (props.membershipInfo) {
		return (
			<div className="my-8">
				<h2>Membership</h2>
				<div>{props.membershipInfo.publicKey.toBase58()}</div>
				<div>bump: {props.membershipInfo.data.bump}</div>
				<div>({props.membershipInfo.data.user.toBase58()})</div>
			</div>)
	} else {
		return (<div> loading Wallet</div>)
	}
}


export default ShowMembership
