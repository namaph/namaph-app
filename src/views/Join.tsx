import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteComponentProps } from "@reach/router";
import { useEffect, useState } from "react";
import { projectName, discordInviteLink } from "../constants";
import { fetchMultisig, fetchTopology } from "../fetch";
import { IMultisig } from '../model';

const Join = (props: RouteComponentProps) => {
	const [multisigData, setMultisigData] = useState<undefined | IMultisig>(undefined);

	useEffect(() => {
		const get = async () => {
			const { data: topologyData } = await fetchTopology(projectName);
			const account = await fetchMultisig(topologyData.multisig)
			setMultisigData(account.data);
		}
		get();
	}, [])

	const threshold = () => {
		if (multisigData) {
			return (<span>現在、{multisigData.owners.length}人中、{multisigData.threshold.toString()}人の承認が必要です。</span>)
		} else {
			return (<span>一定数の承認が必要になります。</span>)
		}
	}

	return (
		<div className="flex flex-col max-w-lg space-y-8">
			<h1 className="font-semibold">How to Join the Namaph Project</h1>
			<div>Namaph は『みんな』で生物多様性シミュレーションを育てていくブロジェクトです。このプロジェクトの詳細はこちらから。</div>
			<h2 className="font-semibold">必要なもの:</h2>

			<div>
				<ul className="list-decimal list-inside ml-2 mt-3">
					<li>Phantom ウォレット対応ブラウザ</li>
					<li>ブラウザ拡張プラグイン(<a href="https://addons.mozilla.org/en-US/firefox/addon/phantom-app/">firefox</a> / <a href="https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa">chrome</a>)</li>
					<li>Discord 登録</li>
					<li>twitter もしくは、 githubのアカウント</li>
				</ul>
				<div className="text-sm">
iPhoneをお持ちの方は、1.と2.のかわりに、<a href="https://apps.apple.com/us/app/phantom-solana-wallet/id1598432977">Phantom Wallet アプリ</a>もあります。投票などはこちらのほうが簡単であり、生体認証もあるのでおすすめです。
				</div>
			</div>

			<h2 className="font-semibold">参加のしかた:</h2>

			<div className="flex flex-col space-y-6 ml-2">
				<div>
					<h2>step1. Discord サーバーに参加しましょう</h2>
					<p className="mt-2 ml-2 text-sm">Discordサーバーへの参加が必要になります。</p> 					
					<a href={discordInviteLink}>
					<div className="p-2 py-3 bg-white mt-3 flex place-content-center items-center gap-3 rounded hover:underline">
					<FontAwesomeIcon icon={faDiscord} size="2x"/><span>Discord Link</span>
					</div>
					</a>


				</div>
				<div>
					<h2>step2. 『参加申請』チャンネルで必要情報を記入する</h2>					
					<p className="mt-2 ml-2 text-sm"> Discord内部の『参加申請』のチャンネルにて、ウォレットのアドレス(公開鍵ともいわれます。)と、twitterもしくはgithubのアカウントを記入してください。捨て垢による議席水増し対策です。
</p> 					
	
			</div>
				<div>
					<h2>step3. 現参加者が、新規参加の議題を提言します。</h2>
					<p className="mt-2 ml-2 text-sm">DAO参加者のうちだれかが、あなたを提言を通して推薦します。Discordの中で知りあいがいれば、話してみましょう。</p>
				</div>
				<div>
					<h2>step4. 投票が行なわれます</h2>
					<p className="mt-2 ml-2 text-sm">参加者の中であなたを迎いれるべきか、投票がおこなわれます。{threshold()} 気長にまちましょう。</p>
				</div>
				<div>
					<h2>step5. 承認されれば、なかま入りです!</h2>
				</div>

			</div >
		</div >
	)
}


export default Join;
