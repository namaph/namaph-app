import React from 'react';
import { RouteComponentProps } from "@reach/router";
import { WorkspaceContext } from '../workspace';

const Home = (props: RouteComponentProps) => {
	const context = React.useContext(WorkspaceContext);
	const network = context.network as string;

	console.log(network);

	return (
		<div>
			image
		</div>
	)
};

export default Home;
