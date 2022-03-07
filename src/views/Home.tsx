import { Link, RouteComponentProps } from "@reach/router";
import { useEffect, useState } from "react";
import { projectName } from "../constants";
import { fetchTopology } from "../fetch";
import { getCityIoValues, pushCityioValues } from '../cityio';
import { getLatestVis, IVis } from '../simulation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import ShowViz from "../components/showVis";

const Home = (props: RouteComponentProps) => {

	const [values, setValues] = useState(new Uint8Array());
	const [viz, setViz] = useState<undefined | IVis>();

	useEffect(() => {

		const getData = async () => {
			const topologyAccount = await fetchTopology(projectName);
			const v = topologyAccount.data.values;
			setValues(v);

			// cityio
			let currentCityIOData = await getCityIoValues();

			let different = false;
			for (let i = 0; i < v.length; i++) {
				if (parseInt(currentCityIOData[i]) !== v[i]) {
					different = true;
					break;
				}
			}

			if (different) {
				console.log('pushing to cityio...');
				await pushCityioValues(v);
			}

			setViz(await getLatestVis());
		}

		getData();

	}, [])

	useEffect(()=>{
	})

	const showValues = () => {
		if (values.length === 0) {
			return (
				<div>
					values are empty
				</div>
			)
		} else {

			const elements = Buffer.from(values).toJSON().data.map((v,i)=>(
			<div key={`item-${i}`} className="bg-white w-3 text-center rounded">
			{v}
			</div>
			));

			return elements
		}
	}

	return (
		<div className="flex flex-col space-y-4">
			<div>
				<div className="font-semibold">Current Result:
				<Link to="/about" className="font-normal text-xs ml-3 underline italic"><FontAwesomeIcon icon={faCircleQuestion}/> what is this?</Link>
				</div>
				<ShowViz vis={viz}/>
				</div>
			<div>
				<div className="font-semibold">Node Values:</div>
				<div className="flex flex-row justify-between">
				{showValues()}
				</div>
			</div>
		</div>
	)

};

export default Home;
