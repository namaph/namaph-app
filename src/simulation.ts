const simBase = 'https://instant-sim-gnegwwbfoa-an.a.run.app/api/v1/';

const simResultsEndpoint = `${simBase}results`;
const simVisEndpoint = `${simBase}vizresult/`;
export const simResultEndpoint = `${simBase}/result/`;

export const getResults = async () => {
	const response = await fetch(simResultsEndpoint);
	const results = await response.json();
	return results
}

interface ResultsResponseItem {
	id: string,
	model_name: 'biodiv' | 'economics' | 'quantum',
	status: string,
	timestamp: string
}

interface VizResultResponse {
	simid: string,
	timestamp: string,
	vizresult: VizResult[] 
}

interface VizResult{
	id: string,
	status: number,
	step: number,
	url: string,
}

export interface IViz {
	id: string,
	timestamp: string,
	step: number,
	url: string,
}

// just get the biodiv for now
export const getIds = (results: ResultsResponseItem[]) => {
	return results
	.filter(r => (r.status === 'done'))
	.filter(r => (r.model_name === 'biodiv'))
}

export const getImageUrls = async (simResult: ResultsResponseItem) => {
	const response = await fetch(`${simVisEndpoint}${simResult.id}`, {
		headers:{
			'accept': 'application/json'
		}
	});

	const visResult = await response.json()
	return {...visResult, timestamp: simResult.timestamp};
}

export const getImage = (visResultResonse: VizResultResponse): IViz | undefined=> {

	const results: VizResult[] = visResultResonse.vizresult;

	const sorted = results
		.sort((a, b)=>b.step-a.step)
		.filter(r => r.url.endsWith('graph.png'));

	const {id, step, url} = sorted[0];


	return {id, step, url, timestamp: visResultResonse.timestamp}
}

export const getLatestVis = async (): Promise<undefined|IViz> => {

	let visResult;
	try{
		const results = await getResults();
		const ids = getIds(results);
		visResult = await getImageUrls(ids[0])
	} catch {
		return undefined
	}

	return getImage(visResult)
}

