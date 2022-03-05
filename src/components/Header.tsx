import { projectName } from "../constants"
import { Link } from '@reach/router';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Navigation from "./Navigation";
import { useContext } from "react";
import { AppStateContext } from "../workspace";
import { AppState } from "../model";

const Title = () => {
	return (
		<Link to="/" className="basis-1/3 self-center"><h1>{projectName}</h1></Link>
	)	
}

const Status = () => {
	
	const value = useContext(AppStateContext);
	
	let status = '';
	switch (value) {
		case AppState.Disconnected:
			status = 'disconnected';
			break;
		case AppState.WalletConnected:
			status = 'not member';
			break;
		case AppState.Member:
			status = 'member';
	}

	return (
		<div className="basis-1/3 self-center">
			{status}
		</div>
	)
}

const Header = () => {
	return (
		<>
		<div className="flex flex-row justify-items-stretch">
			<Title/>	
			<Status />
			<WalletMultiButton/>
		</div>
		<Navigation />
		</>
	)
}

export default Header;
