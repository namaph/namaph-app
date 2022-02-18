interface IShowArweaveImageProps {
	txid: string,
}

const ShowArweaveImage = (props: IShowArweaveImageProps) => {
	if(props.txid === '') {
		return(<img alt="placeholder" src="https://arweave.net/TBrsdaAnYr0C0JQXKMlwJA2sd_W4RQfknotqZYytdWI"/>)
	} else {
		const url = `https:://arweave.net/${props.txid}`;
		return(<img alt="main" src={url}/>)
	}
}

export default ShowArweaveImage;
