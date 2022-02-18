import React, { useEffect, useState, useContext } from 'react';
import { fetchRegistry } from '../api/fetch';
import { registryPubkey } from '../constants';
import { RouteComponentProps } from "@reach/router";
import { WorkspaceContext } from '../App';
import { IRegistry } from '../model/model';
import ShowHome from '../components/ShowHome';


const Home = (props: RouteComponentProps) => {
	let { shardProgram } = useContext(WorkspaceContext);
	let [registry, setRegistry] = useState<null | IRegistry>(null);
	useEffect(() => {
		const fetchData = async () => {
			if (shardProgram) {
				const reg = await fetchRegistry(registryPubkey, shardProgram);
				setRegistry(reg);
			}
		}
		fetchData();
	}, [shardProgram])

	return (
		<div>
			<ShowHome pubkey={registryPubkey} registry={registry}/>
		</div>
	)
};

export default Home;
