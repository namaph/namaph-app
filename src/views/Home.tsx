import { Link, RouteComponentProps } from "@reach/router";
import { useEffect, useState } from "react";
import { projectName } from "../constants";
import { fetchTopology } from "../fetch";
import { getCityIoValues, pushCityioValues } from '../cityio';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

const Home = (props: RouteComponentProps) => {

	const [values, setValues] = useState(new Uint8Array());

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
		}

		getData();
	}, [])

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
				<img alt="dummy simulation result" src={process.env.PUBLIC_URL + 'result-dummy.png'} />
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
