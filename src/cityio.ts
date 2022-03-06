const cityioBase = 'https://cityio.media.mit.edu/api/';
const ioTableName = 'namaph';

export const getCityIoValues = async () => {
	const data = await fetch(`${cityioBase}table/${ioTableName}/values/`);	
	const result = await data.json();	
	return result;
}

export const pushCityioValues = async (values: Uint8Array) => {

    let buffer = Buffer.from(values);
	let array: number[] = []
	buffer.map(value => array.push(parseInt(`${value}`)));

	console.log('pushing data to cityio', JSON.stringify(array));

	try{
	const data = await fetch(`${cityioBase}table/${ioTableName}/values/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(array)
	});

	console.log(await data.json());
	} catch (e) {
		// this dosen't work in localhost?
		console.log(e);
	}
}

export const getCityIoNodeLabels = async () => {
	const data = await fetch(`${cityioBase}table/${ioTableName}/labels/`)
	const list = await data.json();
	return list;
}
