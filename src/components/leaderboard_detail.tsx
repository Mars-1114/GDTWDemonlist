import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";
import {VideoLink} from "./image_link.tsx";
import {PlayerInfo} from "./player_info.tsx";
import Mobile from "../assets/img/mobile.png";
import TwoPlayer from "../assets/img/2P.png"

function LeaderboardDetailUnit({lvl_detail, record, rank}: {lvl_detail: obj.FormattedLevel, record: obj.RawRecord, rank: number}) {
    let mobileIndicator = record.is_mobile ? <img alt="mobile completion" width="25px" src={Mobile} /> : null;
    let twoPlayerIndicator = lvl_detail.two_player ? <img alt="2P completion" width="25px" src={TwoPlayer} /> : null;
    let displayRank = !lvl_detail.is_legacy ? <span>#{rank}</span> : null;
    let vidLink = <VideoLink url={record.url} />
    let points = !lvl_detail.is_legacy ? <span>{lvl_detail.points} pts</span> : null;

    return (
      <div>
          <span>
              {twoPlayerIndicator}
              {mobileIndicator}
          </span>
          {displayRank} {lvl_detail.name} {points} {record.date} {vidLink}
      </div>
    );
}

export function LeaderboardDetail({player, playerDetail, playerInfo, demonlist}: {player: string, playerDetail: obj.FormattedPlayer, playerInfo: obj.RawPlayerInfo, demonlist: obj.Demonlist}) {
    let rows: JSX.Element[] = [];
    playerDetail.records.forEach((record, lvl_id) => {
        rows.push(
          <LeaderboardDetailUnit key={lvl_id} lvl_detail={demonlist.get(lvl_id)!} record={record} rank={demonlist.get(lvl_id)!.local_rank}/>
        );
    })
    return (
          <div>
              <PlayerInfo name={player} info={playerInfo} />
              <div style={{display: "grid", gridTemplateColumns: "auto auto auto"}}>
                  <div>排名</div>
                  <div>分數</div>
                  <div>關卡數</div>
                  <div>{playerDetail.rank}</div>
                  <div>{playerDetail.points}</div>
                  <div>{playerDetail.exd_count}</div>
              </div>
              <div>
                  <h4>通關關卡</h4>
                  {rows}
              </div>
          </div>
    );
}