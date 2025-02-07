import { useContext, useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { RouteComponentProps } from "@reach/router";
import { AppStateContext } from '../workspace';
import { AppState, IMultisigTransaction } from '../model';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Idl, Program, Provider, Wallet } from '@project-serum/anchor';
import { connection, projectName, namaphProgram as nPId, multisigProgram as mPId } from '../constants';
import nIdl from '../idl/namaph_multisig.json';
import mIdl from '../idl/serum_multisig.json';
import { fetchTopology } from '../fetch';

import ProposeChangeThreshold from '../components/ProposeChangeThreshold';
import ProposeSpend from '../components/ProposeSpend';
import ProposeAddOwner from '../components/ProposeAddOwner';
import ProposeUpdateTopology from '../components/ProposeUpdateTopology';
import ProposeAddTextTopic from '../components/ProposeAddTextTopic';
import ProposeAddUrlTopic from '../components/ProposeAddUrlTopic';

const Propose = (props: RouteComponentProps) => {
	const appState = useContext(AppStateContext);
	const wallet = useAnchorWallet();
	const [signer, setSigner] = useState<undefined | PublicKey>();
	const [mTx, setMtx] = useState<undefined | IMultisigTransaction>();

	useEffect(() => {
		const init = async () => {
			if (wallet) {
				const commitment = 'processed';
				const provider = new Provider(connection, wallet as Wallet, { preflightCommitment: commitment, commitment });
				const namaphProgram = new Program(nIdl as Idl, nIdl.metadata.address, provider);
				const multisigProgram = new Program(mIdl as Idl, mIdl.metadata.address, provider);
				const programs = { namaph: namaphProgram, multisig: multisigProgram };

				const topologyAccount = await fetchTopology(projectName);

				const [proposer] = await PublicKey.findProgramAddress([
				Buffer.from('membership'), 
				topologyAccount.data.multisig.toBytes(), 
				wallet!.publicKey.toBytes()],
					nPId);

				const [signer] = await PublicKey.findProgramAddress(
					[topologyAccount.data.multisig.toBytes()],
					mPId
				);

				setSigner(signer);
				setMtx(
					{ programs, multisig: topologyAccount.data.multisig, proposer });
			}

		}
		init();
	}, [wallet])


	if (appState !== AppState.Member) {
		return (
			<div>
				You need to be a member in order to propose topics.
			</div>
		)
	} else if (signer === undefined || mTx === undefined) {
		return (<div>
			something wrong with signer and mTx
		</div>
		)
	} else {
		return (
		<div>
			<div>
			Propose topics to run the DAO!
			</div>
			<div className="mb-5">
				<h1 className="font-semibold text-lg mt-10 mb-5">Topology related topics:</h1>
				<div className="ml-2">
				<ProposeUpdateTopology signer={signer} mTx={mTx} />
				<ProposeSpend signer={signer} mTx={mTx} />
				</div>
			</div>
			<div>
			<div>
				<h1 className="font-semibold text-lg mt-10">Multisig related topics:</h1>
				<div className="ml-2">
				<p className="text-sm max-w-lg mb-5">Admin topics to change the constiuencies of the group. Once set of the owners change, the 'set sequence number' will be incremented. This will make the topics stale that was unapproved under that previous sequence number. The threshold is the minimum number of approvals requied to pass a topic.</p>
				<ProposeAddOwner signer={signer} mTx={mTx} />
				<ProposeChangeThreshold signer={signer} mTx={mTx} />
				</div>
			</div>
			<div>
				<h1 className="font-semibold text-lg mt-10">Others:</h1>
				<div className="ml-2">
				<p className="text-sm max-w-lg mb-5">
				These may not directly tied to a smart contract, but will be useful for deciding the direction of the community. Proposing a url can also used for specific Pull Request for code.
				</p>
				<ProposeAddUrlTopic signer={signer} mTx={mTx} />
				<ProposeAddTextTopic signer={signer} mTx={mTx} />
				</div>
			</div>
			</div>
		</div>
		)
	}
};

export default Propose;
