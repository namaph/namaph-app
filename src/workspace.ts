import React from 'react';


interface IWorkspace {
	network: string | null
}

export const WorkspaceContext = React.createContext({
	network: 'devnet'
} as IWorkspace);
