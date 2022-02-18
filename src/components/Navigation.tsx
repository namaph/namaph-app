import { Link } from "@reach/router";

const Navigation = () => {
	return (
		<div className="flex justify-between font-semibold">
			<Link to="/" className="p-3 px-5 border border-green-300 hover:bg-green-200 rounded-full "> Home </Link>
			<Link to="list" className="p-3 px-5 border border-green-300 hover:bg-green-200 rounded-full "> List </Link>
			<Link to="propose" className="p-3 px-5 border border-green-300 hover:bg-green-200 rounded-full "> Propose </Link>
			{/* <Link to="status" className="p-3 px-5 border border-green-300 hover:bg-green-200 rounded-full "> Status </Link>
			*/}
		</div>
	)
}

export default Navigation;
