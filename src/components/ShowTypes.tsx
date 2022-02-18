import { CSSProperties } from "react";

interface IShowTypes {
	types: Buffer,
	size: number
}

const ShowTypes = (props: IShowTypes) => {
	if (props.types) {

		let rects = [];

		for (let i = 0; i < props.types.length; i++) {
			const style = typeToStyle(props.types[i]);
			const x = i % props.size;
			const y = Math.floor(i / props.size);
			rects.push(<rect key={`${x}${y}`} x={x*100} y={y*100} width={90} height={90} style={style} />);
		}

		return (<svg width="400" height="400">
			{rects}
		</svg>)
	} else {
		return (<div>Types Loading</div>)
	}
}

const typeToStyle = (id: number) => {
	let cssProperties: CSSProperties = {};
	switch (id) {
		case 0:
			cssProperties['fill'] = '#a3be8c';
			break;
		case 1:
			cssProperties['fill'] = '#d08770';
			break;
		case 2:
			cssProperties['fill'] = '#b48ead';
			break;
		default:
			cssProperties['fill'] = '#2e3440';
	}

	return cssProperties
}

export default ShowTypes;
