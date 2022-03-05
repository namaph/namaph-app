import { RouteComponentProps } from "@reach/router";
import { useEffect, useState } from "react";
import { projectName } from "../constants";
import { fetchTopology } from "../fetch";

const Home = (props: RouteComponentProps) => {

	const [values, setValues] = useState(new Uint8Array());

	useEffect(() => {

		const getData = async () => {
			const topologyAccount = await fetchTopology(projectName);
			const v = topologyAccount.data.values;
			setValues(v);
		}

		getData();
	}, [])

	const showValues = () => {
		if (values.length == 0) {
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
