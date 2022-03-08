import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { discordInviteLink, githubOrgLink } from "../constants";

const Footer = () => {
	return (
		<div className="my-5 flex flex-row space-y-4 items-center border-t border-gray-800">
			<div className="w-1/2 flex flex-row  space-x-3">
			<a href={discordInviteLink} className="font-semibold"><FontAwesomeIcon icon={faDiscord} size="lg" /></a>
			<a href={githubOrgLink}> <FontAwesomeIcon icon={faGithub} size="lg" /></a>
			</div>
			<div className="text-xs w-1/2" >
				This project is sponsored by <a className="underline" href="https://creators.j-mediaarts.jp/archive/2021-2022">'Support Emerging Media Arts Creators'</a> program by Japan's Agency for Cultural Affairs.
			</div>
		</div>
	)
}

export default Footer;
