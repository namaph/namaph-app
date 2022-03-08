import { Link } from '@reach/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faClipboardList, faPenNib, faCircleInfo, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { AppStateContext } from '../workspace';
import { AppState } from '../model';

const Navigation = () => {

	const appState = useContext(AppStateContext);


	if(appState === AppState.Member) {
	return (
	<div className="flex flex-row justify-between text-xs">
		<Link to="/" className="w-1/5 flex flex-col space-y-1 place-items-center bg-white hover:bg-gray-800 hover:text-gray-100 px-4 py-3 rounded-full">
				<FontAwesomeIcon icon={faHouse} />
				<p>home</p>
		</Link>

		<Link to="/list" className="w-1/5 flex flex-col  space-y-1 place-items-center bg-white hover:bg-gray-800 hover:text-gray-100 px-4 py-3 rounded-full">
				<FontAwesomeIcon icon={faClipboardList} />
				<p>list</p>
		</Link>

		<Link to="/propose" className="w-1/5 flex flex-col  space-y-1 place-items-center bg-white hover:bg-gray-800 hover:text-gray-100 px-4 py-3 rounded-full">
				<FontAwesomeIcon icon={faPenNib} />
				<p>topic</p>
		</Link>


		<Link to="/info" className="w-1/5 flex flex-col  space-y-1 place-items-center bg-white hover:bg-gray-800 hover:text-gray-100 px-4 py-3 rounded-full">
				<FontAwesomeIcon icon={faCircleInfo} />
				<p>info</p>
		</Link>
	</div>
	)
	} else {
	return (<div className="flex flex-row justify-between text-xs">
		<Link to="/" className="w-1/5 flex flex-col space-y-1 place-items-center bg-white hover:bg-gray-800 hover:text-gray-100 px-4 py-3 rounded-full">
				<FontAwesomeIcon icon={faHouse} />
				<p>home</p>
		</Link>

		<Link to="/list" className="w-1/5 flex flex-col  space-y-1 place-items-center bg-white hover:bg-gray-800 hover:text-gray-100 px-4 py-3 rounded-full">
				<FontAwesomeIcon icon={faClipboardList} />
				<p>list</p>
		</Link>

		<Link to="/join" className="w-1/5 flex flex-col  space-y-1 place-items-center bg-yellow-200 hover:bg-gray-800 hover:text-yellow-200 px-4 py-3 rounded-full">
				<FontAwesomeIcon icon={faFaceSmile} spin speed={10} />
				<p>join</p>
		</Link>

	</div>)
	}
}


export default Navigation;
