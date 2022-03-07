const simBase = 'https://sim-gnegwwbfoa-uw.a.run.app/';

const simResultsEndpoint = `${simBase}results`;
const simVisEndpoint = `${simBase}vizresult/`;
export const simResultEndpoint = `${simBase}/result/`;
const simVisUrlBase = 'https://storage.googleapis.com/instant-sim-viz/';
const simVisUrlpostamble = '_grid.png';

// https://storage.googleapis.com/instant-sim-viz/22e0d5e8-f4c9-4f47-bf87-e8f485ee5449_1_grid.png

export const getResults = async () => {
	const response = await fetch(simResultsEndpoint);
	const results = await response.json();
	return results
}

interface ISimResultMeta {
	id: string,
	model_name: 'biodiv' | 'economics' | 'quantum',
	status: number,
	timestamp: string
}

interface ISimVisResult {
	id: string,
	url: string[],
	step: number[],
	status: string
}

export interface IVis {
	id: string,
	step: number,
	url: string,
}

// just get the biodiv for now
export const getIds = (results: ISimResultMeta[]): string[] => {
	return results
	.filter(r => (r.model_name === 'biodiv' || r.model_name === 'economics'))
	.map(s => s.id);
}

export const getImageUrls = async (id:string) => {
	const response = await fetch(`${simVisEndpoint}${id}`, {
		headers:{
			'accept': 'application/json'
		}
	});

	const visResult = await response.json() as ISimVisResult;
	return visResult;
}

export const getImage = (visResult: ISimVisResult): IVis | undefined=> {
	if(visResult.status !== 'done') return undefined;
	const step = Math.max(...visResult.step);
	const id = visResult.id;
	const url = 
		`${simVisUrlBase}${id}_${step}${simVisUrlpostamble}`;			

	return {id, step, url}
}

export const getLatestVis = async (): Promise<undefined|IVis> => {
	
	let visResult: ISimVisResult;

	try{
		const results = await getResults();
		const ids = getIds(results);
		visResult = await getImageUrls(ids[0]);
	} catch {
		return undefined
	}

	return getImage(visResult)
}

