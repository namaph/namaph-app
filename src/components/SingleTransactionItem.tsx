import { FC, useContext } from 'react';
import { PublicKey } from '@solana/web3.js';
import { AppState, ITransaction } from '../model';
import { namaphICoder, multisigICoder, namaphProgram } from '../constants';
import { BN, Instruction } from '@project-serum/anchor';
import ApproveButton from './ApproveButton';
import ExecuteButton from './ExecuteButton';
import { AppStateContext } from '../workspace';
import { useWallet } from '@solana/wallet-adapter-react';

type SingleTransactionProps = {
	publicKey: PublicKey,
	data: ITransaction
}

const SingleTransactionItem: FC<SingleTransactionProps> = ({ publicKey, data }) => {
	const appState = useContext(AppStateContext);
	const { publicKey: user } = useWallet();
	const whichProgram = data.programId.toBase58() === namaphProgram.toBase58() ? 'namaph' : 'multisig';

	let ix = <>instruction</>;
	if (whichProgram === 'namaph') {
		const instruction = namaphICoder.decode(data.data as Buffer);
		ix = getNamapInstructionInfo(instruction!, data);
	} else {
		const instruction = multisigICoder.decode(data.data as Buffer);
		ix = getMultisigInstructionInfo(instruction!, data);
	}

	const execute = data.didExecute ? <></> : <ExecuteButton transaction={publicKey} />;
	const approve = appState === AppState.Member ? <ApproveButton user={user!} multisig={data.multisig} transaction={publicKey} txSigners={data.signers} /> : <></>;

	return (<div>
		<hr />
		<div> {ix} </div>
		<div> which: {whichProgram} </div>
		<div> approval: {data.signers.map(b => b.toString())}</div>
		<div> transaction: {publicKey.toBase58()} </div>
		{approve}
		{execute}
		<hr />
	</div>)
};



const getNamapInstructionInfo = (instruction: Instruction, data: ITransaction) => {
	switch (instruction.name) {
		case 'updateTopology':
			{
				const title = 'Update Topology';
				const updateTopology = instruction.data as IUpdateTopology;
				return (
					<>
						<div>{title}</div>
						<div>node({updateTopology.id}) updates to {updateTopology.value}.</div>
					</>
				)
			}
		case 'spend':
			{
				const title = 'DAO pays';
				const spend = instruction.data as ISpend;
				const to = data.accounts[2].pubkey;
				return (
					<>
						<div>{title}</div>
						<div>spends {spend.amount.toString()} lamports to {to.toBase58()}</div>
					</>
				)
			}
		case 'updateTextTopic':
			{
				const textTopicData = instruction.data as IUpdateTextTopic;
				return (
					<>
						<div>{textTopicData.title}</div>
						<div>{textTopicData.body}</div>
					</>
				)
			}
		case 'updateUrlTopic':
			{
				const urlTopicData = instruction.data as IUpdateUrlTopic;
				return (
					<>
						<div>{urlTopicData.title}</div>
						<div>{urlTopicData.url}</div>
					</>
				)
			}
		default:
			{
				console.log(instruction);
				return (<>
					<div>unknown instruction</div>
				</>)
			}
	}
}

const getMultisigInstructionInfo = (instruction: Instruction, data: ITransaction) => {
	switch (instruction.name) {
		case 'changeThreshold':
			{
				const title = 'Change Threshold';
				const { threshold } = instruction.data as IThreshold;
				return (
					<>
						<div>{title}</div>
						<div>change threshold to {threshold.toString()}</div>
					</>
				)
			}
		case 'setOwners':
			{
				const title = 'Change Owners';
				const { owners } = instruction.data as ISetOwners;
				const ownersShow = owners.map((k) => {
					return (
						<div>{k.toBase58()}</div>
					)
				})
				return (
					<>
						<div>{title}</div>
						<div>changes the constituencies</div>
						<details>
							{ownersShow}
						</details>
					</>
				)
			}
		default:
			{
				console.log(instruction);
				return (<>
					<div>unknown instruction</div>
				</>)
			}
	}
}


export default SingleTransactionItem;


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

