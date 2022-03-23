import { FC, useContext } from 'react';
import { PublicKey } from '@solana/web3.js';
import { AppState, ITransaction } from '../model';
import { namaphICoder, multisigICoder, namaphProgram } from '../constants';
import { BN, Instruction } from '@project-serum/anchor';
import ApproveButton from './ApproveButton';
import ExecuteButton from './ExecuteButton';
import MembershipList from './MemberList';
import { AppStateContext } from '../workspace';
import { useWallet } from '@solana/wallet-adapter-react';
import { displayPubkey } from '../utility';


type SingleTransactionProps = {
	publicKey: PublicKey,
	data: ITransaction,
	threshold: Number,
	seqNo: Number,
}

const SingleTransactionItem: FC<SingleTransactionProps> = ({ publicKey, data, threshold, seqNo }) => {
	const appState = useContext(AppStateContext);
	const { publicKey: user } = useWallet();
	const whichProgram = data.programId.toBase58() === namaphProgram.toBase58() ? 'namaph' : 'multisig';

	let title = '';
	let contents = <></>;


	if (whichProgram === 'namaph') {
		const instruction = namaphICoder.decode(data.data as Buffer);
		({title, contents} = getNamapInstructionInfo(instruction!, data));
	} else {
		const instruction = multisigICoder.decode(data.data as Buffer);
		({title, contents} = getMultisigInstructionInfo(instruction!, data));
	}

	let numApproved = 0;

	data.signers.forEach((b)=>{
		if (b) {
			numApproved += 1;
		}
	});

	const isExecutable = threshold <= numApproved;

	const buttons = () => {
		if (appState === AppState.Member && !data.didExecute && data.ownerSetSeqno === seqNo) {
			return(
				<div className="flex flex-col space-y-5 place-items-end p-2">
					<div>
					<ApproveButton user={user!} multisig={data.multisig} transaction={publicKey} txSigners={data.signers} />
					</div>
					<div>
					<ExecuteButton transaction={publicKey} isExecutable={isExecutable}/>	
					</div>

				</div>
			)
		}
	}


	return (
		<div>
			<div className="flex flex-row justify-between">
				<div className="font-semibold mb-2 text-lg"> {title} </div>
				<div className="text-xs"> <a className="underline" href={`https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`}>{displayPubkey(publicKey)}</a></div>
			</div>
			<div> {contents} </div>
			<div className="text-green-600">approved by {numApproved} out of {data.signers.length} users.</div>
			{buttons()}
		</div>)
};



const getNamapInstructionInfo = (instruction: Instruction, data: ITransaction) => {

	let title;
	let contents;

	switch (instruction.name) {
		case 'updateTopology':
			{
				title = 'Update Zoning / ゾーニング更新';
				const updateTopology = instruction.data as IUpdateTopology;
				contents = <div>node({updateTopology.id}) updates to {updateTopology.value}.</div>;
				break;
			}
		case 'spend':
			{
				title = 'DAO pays / 共同出資';
				const spend = instruction.data as ISpend;
				const to = data.accounts[2].pubkey;
				contents =
					<div>spends {spend.amount.toString()} lamports to {to.toBase58()}</div>;
				break;
			}
		case 'updateTextTopic':
			{
				const textTopicData = instruction.data as IUpdateTextTopic;
				title = `text: ${textTopicData.title}`;
				contents = <div>{textTopicData.body}</div>;
				break;
			}
		case 'updateUrlTopic':
			{
				const urlTopicData = instruction.data as IUpdateUrlTopic;
				title = `url: ${urlTopicData.title}`;
				contents = <div><a className="underline" href={urlTopicData.url}>{urlTopicData.url}</a></div>
				break;
			}
		default:
			title = 'unknown topic';
			contents = <></>
	}
	return {title, contents}
}

const getMultisigInstructionInfo = (instruction: Instruction, data: ITransaction) => {

	let title;
	let contents;

	switch (instruction.name) {
		case 'changeThreshold':
			{
				title = 'Change Threshold / 定足数の更新';
				const { threshold } = instruction.data as IThreshold;
				contents = <div>change threshold to {threshold.toString()}</div>
				break;
			}
		case 'setOwners':
			{
				title = 'Change Owners / 構成員の変更';
				const { owners } = instruction.data as ISetOwners;
				contents = 
				(	<>
						<div>changes the constituencies</div>
						<details>
							<MembershipList memberships={owners} />
						</details>
					</>
				)
				break;
			}
		default:
			{
				title='unknown topic';
				console.log(instruction);
				contents = (<>
					<div>unknown instruction</div>
				</>);
			}
	}
	return {title, contents}
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
