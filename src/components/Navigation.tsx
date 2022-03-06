import { Link } from '@reach/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faClipboardList, faPenNib, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
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
}


export default Navigation;
