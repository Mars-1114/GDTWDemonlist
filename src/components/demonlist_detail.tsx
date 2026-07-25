import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";
import { Publisher } from "./publisher";
import { VideoLink } from "./image_link.tsx";

import Mobile from "../assets/img/mobile.png";

interface DemonlistDetailProps {
    lvlId: string;
    level: obj.FormattedLevel;
}

interface DemonlistDetailUnitProps {
    player: string;
    record: obj.RawRecord;
    rank: number;
}

function DemonlistDetailUnit({ player, record, rank }: DemonlistDetailUnitProps) {
    let mobileIndicator = record.is_mobile ? <img alt="mobile completion" width="25px" src={Mobile} /> : null;
    let vidLink = <VideoLink url={record.url}/>;

    return (
        <div>
            <span>
                {mobileIndicator}
            </span>
            #{ rank } { player } { record.date } {vidLink}
        </div>
    );
}

export function DemonlistDetail({ lvlId, level }: DemonlistDetailProps) {
    let rows: JSX.Element[] = [];
    let rank = 0;
    level.records.forEach((record, player) => {
        ++rank;
        rows.push(
            <DemonlistDetailUnit key={player} record={record} player={player} rank={rank}/>
        );
    })

    let displayId = level.two_player ? lvlId.substring(0, lvlId.length - 3) : lvlId;
    let displayRank = !level.is_legacy ? <span>#{level.local_rank} [ #{level.aredl_rank} ]</span> : <span>#Legacy</span>;
    return (
        <>
            <div>
                <h2>{level.name}</h2>
                <h4>by <Publisher publisher={level.publisher} publisherId={level.publisher_id} /></h4>
                <div style={{display: "grid", gridTemplateColumns: "auto auto auto"}}>
                    <div>關卡排名</div>
                    <div>ID</div>
                    <div>分數</div>
                    <div>{displayRank}</div>
                    <div>{displayId}</div>
                    <div>{level.points} pts</div>
                </div>
            </div>
            <div>
                <h4>通關玩家</h4>
                { rows }
            </div>
        </>
    );
}