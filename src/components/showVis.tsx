import { IVis, simResultEndpoint } from '../simulation';
import { displayUuid } from '../utility';

import { FC } from "react";

type ShowVizProps = {
	vis: IVis | undefined
}

const ShowViz: FC<ShowVizProps> = ({ vis }) => {
	if (vis) {
		return (
			<div>
				<div className="text-xs text-right mb-2">
					<a className="underline" href={`${simResultEndpoint}${vis.id}`}>id: {displayUuid(vis.id)}</a> step: {vis.step}
				</div>
				<img alt={`simulation result for id${vis.id}`} src={vis.url} />
			</div>
		)
	} else {
		return (
			<div> Loading Simulation visualization </div>
		)	
	}
}


export default ShowViz;
