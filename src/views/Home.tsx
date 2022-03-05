import { RouteComponentProps } from "@reach/router";
import { useEffect, useState } from "react";
import { projectName } from "../constants";
import { fetchTopology } from "../fetch";
import { getCityIoValues, pushCityioValues } from '../cityio';

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
			return (
				<div>
					{values}
				</div>
			)
		}
	}

	return (
		<div>
			<div>
				Node Values:
			</div>
			<div>
				{showValues()}
			</div>
		</div>
	)

};

export default Home;
