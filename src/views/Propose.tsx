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

				console.log('user', wallet.publicKey.toBase58());
				console.log('proposer membership', proposer.toBase58());

				const [signer] = await PublicKey.findProgramAddress(
					[topologyAccount.data.multisig.toBytes()],
					mPId
				);
				console.log('singer', signer.toBase58());

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
				<ProposeChangeThreshold signer={signer} mTx={mTx} />
				<hr />
				<ProposeSpend signer={signer} mTx={mTx} />
				<hr />
				<ProposeAddOwner signer={signer} mTx={mTx} />
				<hr />
				<ProposeUpdateTopology signer={signer} mTx={mTx} />
				<hr />
				<ProposeAddTextTopic signer={signer} mTx={mTx} />
				<hr />
				<ProposeAddUrlTopic signer={signer} mTx={mTx} />
			</div>
		)
	}
};

export default Propose;
