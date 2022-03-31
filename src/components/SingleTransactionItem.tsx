import { FC, useContext } from 'react';
import { PublicKey } from '@solana/web3.js';
import { AppState, ITransaction, IMultisig, ITopology } from '../model';
import { namaphICoder, multisigICoder, namaphProgram, landTypes } from '../constants';
import { BN, Instruction } from '@project-serum/anchor';
import ApproveButton from './ApproveButton';
import ExecuteButton from './ExecuteButton';
import MembershipList from './MemberList';
import { AppStateContext } from '../workspace';
import { useWallet } from '@solana/wallet-adapter-react';
import { displayPubkey } from '../utility';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
type SingleTransactionProps = {
	publicKey: PublicKey,
	data: ITransaction,
	threshold: Number,
	seqNo: Number,
	multisig: IMultisig,
	topology: ITopology,
	nodeLabels: string[],
}

const SingleTransactionItem: FC<SingleTransactionProps> = ({ publicKey, data, threshold, seqNo, multisig, topology, nodeLabels }) => {
	const appState = useContext(AppStateContext);
	const { publicKey: user } = useWallet();
	const whichProgram = data.programId.toBase58() === namaphProgram.toBase58() ? 'namaph' : 'multisig';

	let title = '';
	let contents = <></>;


	if (whichProgram === 'namaph') {
		const instruction = namaphICoder.decode(data.data as Buffer);
		({ title, contents } = getNamapInstructionInfo(instruction!, data, topology, nodeLabels));
	} else {
		const instruction = multisigICoder.decode(data.data as Buffer);
		({ title, contents } = getMultisigInstructionInfo(instruction!, data, multisig));
	}

	let numApproved = 0;

	data.signers.forEach((b) => {
		if (b) {
			numApproved += 1;
		}
	});

	const isExecutable = threshold <= numApproved;

	const buttonsAndCurrent = () => {
		if (appState === AppState.Member && !data.didExecute && data.ownerSetSeqno === seqNo) {
			return (
				<div>
					{current()}
					{buttons()}
				</div>
			)
		}
	}

	const buttons = () => {
		return (
			<div className="flex flex-col space-y-5 place-items-end p-2">
				<div>
					<ApproveButton user={user!} multisig={data.multisig} transaction={publicKey} txSigners={data.signers} />
				</div>
				<div>
					<ExecuteButton transaction={publicKey} isExecutable={isExecutable} />
				</div>
			</div>
		)
	}

	const current = () => {
		<div>current status</div>
	}


	return (
		<div>
			<div className="flex flex-row justify-between">
				<div className="font-semibold mb-2 text-lg"> {title} </div>
				<div className="text-xs"> <a className="underline" href={`https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`}>{displayPubkey(publicKey)}</a></div>
			</div>
			<div> {contents} </div>
			<div className="text-green-600">approved by {numApproved} out of {data.signers.length} users.</div>
			{buttonsAndCurrent()}
		</div>)
};



const getNamapInstructionInfo = (instruction: Instruction, data: ITransaction, topology: ITopology, nodeLabels: string[]) => {

	let title;
	let contents;

	switch (instruction.name) {
		case 'updateTopology':
			{
				title = 'Zoning type';
				const updateTopology = instruction.data as IUpdateTopology;
				const before = landTypes[topology.values[updateTopology.id]];
				const after = landTypes[updateTopology.value]
				if (!data.didExecute) {
					contents = (<div>
						<div className="text-5xl font-bold mb-5">
							update '{nodeLabels[updateTopology.id]}'
						</div>
						{deltaTable(before, after)}
					</div>);
				} else {
					contents = <div>update node ({updateTopology.id}) to {updateTopology.value}</div>
				}
				break;
			}
		case 'spend':
			{
				title = 'DAO pays';
				const spend = instruction.data as ISpend;
				const to = data.accounts[2].pubkey;
				contents =
					<div className="text-3xl font-semibold"> spends {spend.amount.toString()} lamports to {to.toBase58()}</div>;
				break;
			}
		case 'updateTextTopic':
			{
				const textTopicData = instruction.data as IUpdateTextTopic;
				title = `simple text`;
				contents = <div>
					<div className="text-5xl font-bold mb-5">{textTopicData.title}</div>
					<div className="text-3xl font-semibold">{textTopicData.body}</div>
				</div>;
				break;
			}
		case 'updateUrlTopic':
			{
				const urlTopicData = instruction.data as IUpdateUrlTopic;
				title = `link`;
				contents = <div>
					<div className="text-5xl font-bold mb-5">{urlTopicData.title}</div>
					<div className="text-3xl font-semibold">
					<a className="underline" href={urlTopicData.url}>link</a>
					</div>
				</div>
				break;
			}
		default:
			title = 'unknown topic';
			contents = <></>
	}
	return { title, contents }
}

const deltaTable = (now: string, proposal: string) => 						
(<table className="border border-collapse border-gray-800 my-2 text-2xl">
							<tr className="border border-gray-800">
								<th className="border border-gray-800 p-2">now</th>
								<th className="p-2">proposal</th>
							</tr>
							<tr className="text-center">
								<td className="border border-gray-800 p-2">{now}</td>
								<td className="p-2">{proposal}</td>
							</tr>
						</table>

);

const getMultisigInstructionInfo = (instruction: Instruction, data: ITransaction, multisig: IMultisig) => {

	let title;
	let contents;

	switch (instruction.name) {
		case 'changeThreshold':
			{
				title = 'Threshold';
				const { threshold } = instruction.data as IThreshold;
				contents = <div>change threshold to {threshold.toString()}</div>
				if(!data.didExecute) {
					let delta = 'increse';
					if(multisig.threshold.toNumber() > threshold.toNumber()) {
					delta = 'decrease';
					}
					contents = (
					<div>	
						<div className="text-5xl font-bold mb-5">{`${delta} threshold`}</div>
						{deltaTable(multisig.threshold.toString(), threshold.toString())}
					</div>
					)
				}

				break;
			}
		case 'setOwners':
			{
				title = 'Member List';
				contents = <></>;
				if(!data.didExecute){
				const { owners } = instruction.data as ISetOwners;
				const currentOwners = multisig.owners;

				let newOwners = [];
				const cOwnersBase58 = currentOwners.map(o=>o.toBase58());
				for (let owner of owners) {
					const bs = owner.toBase58();
					if (!cOwnersBase58.includes(bs))	 {
						newOwners.push(owner);	
					}
				}

				let newOwnersElement = <></>;
				if(newOwners.length > 0) {
					newOwnersElement = (
					<div>
					<div className="text-5xl font-bold">add</div>
					<MembershipList memberships={newOwners} prefix="+"/>
					</div>)
				}

				let delOwners = [];
				const ownersBase58 = owners.map(o=>o.toBase58());
				for (let owner of currentOwners) {
					const bs = owner.toBase58();
					if(!ownersBase58.includes(bs)) {
						delOwners.push(owner);
					}
				}

				let delOwnersElement = <></>;
				if(delOwners.length > 0) {
					delOwnersElement = (
					<div>
						<div className="text-5xl font-bold">remove</div>
						<MembershipList memberships={delOwners} prefix="-"/>
					</div>);
				}
				
				contents = (
					<div>
						{newOwnersElement}
						{delOwnersElement}
					</div>
				);
				}
				break;
			}
		default:
			{
				title = 'unknown topic';
				contents = (<>
					<div>unknown instruction</div>
				</>);
			}
	}
	return { title, contents }
}

interface IUpdateTopology {
	id: number,
	value: number,
}

interface ISpend {
	amount: BN
}

interface IUpdateTextTopic {
	title: string,
	body: string
}

interface IUpdateUrlTopic {
	title: string,
	url: string
}


interface IThreshold {
	threshold: BN
}

interface ISetOwners {
	owners: PublicKey[]
}

export default SingleTransactionItem;
