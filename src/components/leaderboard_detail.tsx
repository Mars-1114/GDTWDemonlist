import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";
import {VideoLink} from "./image_link.tsx";
import {PlayerInfo} from "./player_info.tsx";
import Mobile from "../assets/img/mobile.png";
import TwoPlayer from "../assets/img/2P.png"
import {useEffect, useState} from "react";

interface LeaderboardDetailProps {
    player: string;
    playerDetail: obj.FormattedPlayer;
    playerInfo: obj.RawPlayerInfo;
    demonlist: obj.Demonlist;

}

interface LeaderboardDetailUnitProps {
    lvlDetail: obj.FormattedLevel;
    record: obj.RawRecord;
    rank: number;
}

function LeaderboardDetailUnit({lvlDetail, record, rank}: LeaderboardDetailUnitProps) {
    let mobileIndicator = record.is_mobile ? <img alt="mobile completion" width="25px" src={Mobile} /> : null;
    let twoPlayerIndicator = lvlDetail.two_player ? <img alt="2P completion" width="25px" src={TwoPlayer} /> : null;
    let displayRank = !lvlDetail.is_legacy ? <span>#{rank}</span> : null;
    let vidLink = <VideoLink url={record.url} />
    let points = !lvlDetail.is_legacy ? <span>{lvlDetail.points} pts</span> : null;

    return (
      <div>
          <span>
              {twoPlayerIndicator}
              {mobileIndicator}
          </span>
          {displayRank} {lvlDetail.name} {points} {record.date} {vidLink}
      </div>
    );
}

export function LeaderboardDetail({player, playerDetail, playerInfo, demonlist}: LeaderboardDetailProps) {
    const [rankType, setRankType] = useState<"gdtw" | "aredl" | "player">("gdtw");
    const [orderType, setOrderType] = useState<"difficulty" | "alphabet" | "time">("difficulty");
    const [reorderedRecords, setReorderedRecords] = useState(playerDetail.records);

    useEffect(() => {
        switch(orderType) {
            case "alphabet":
                setReorderedRecords(
                    new Map([...playerDetail.records.entries()].sort((a, b) => {
                        return demonlist.get(a[0])!.name.localeCompare(demonlist.get(b[0])!.name);
                })));
                break;
            case "time":
                setReorderedRecords(
                    new Map([...playerDetail.records.entries()].sort((a, b) => {
                        return a[1].record.id - b[1].record.id;
                })));
                break;
            case "difficulty":
            default:
                setReorderedRecords(playerDetail.records);
                break;
        }
    }, [player, orderType]);


    let rows: JSX.Element[] = [];
    reorderedRecords.forEach((record, lvlId) => {
        let rank;
        switch(rankType) {
            case "aredl":
                rank = demonlist.get(lvlId)!.aredl_rank;
                break;
            case "player":
                rank = record.rank;
                break;
            case "gdtw":
            default:
                rank = demonlist.get(lvlId)!.local_rank;
                break;
        }
        rows.push(
            <LeaderboardDetailUnit key={lvlId} lvlDetail={demonlist.get(lvlId)!} record={record.record} rank={rank} />
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
                  <button onClick={() => temp1(orderType, setOrderType)}>{orderType}</button>
                  <button onClick={() => temp2(rankType, setRankType)}>{rankType}</button>
                  {rows}
              </div>
          </div>
    );
}

function temp1(orderType: string, setOrderType: (order: "difficulty" | "alphabet" | "time") => void) {
    if (orderType === "difficulty") {
        setOrderType("alphabet");
    }
    else if (orderType === "alphabet") {
        setOrderType("time");
    }
    else if (orderType === "time") {
        setOrderType("difficulty");
    }
}

function temp2(rankType: string, setRankType: (rank: "gdtw" | "aredl" | "player") => void) {
    if (rankType === "gdtw") {
        setRankType("aredl");
    }
    else if (rankType === "aredl") {
        setRankType("player");
    }
    else if (rankType === "player") {
        setRankType("gdtw");
    }
}