import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";
import { Publisher } from "./publisher";
import { VideoLink } from "./image_link.tsx";

import Mobile from "../assets/img/mobile.png";

function DemonlistDetailUnit({ player, record, rank }: { player: string, record: obj.RawRecord, rank:  number }) {
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

export function DemonlistDetail({ lvl_id, level }: { lvl_id: string, level: obj.FormattedLevel}) {
    let rows: JSX.Element[] = [];
    let rank = 0;
    level.records.forEach((record, player) => {
        ++rank;
        rows.push(
            <DemonlistDetailUnit key={player} record={record} player={player} rank={rank}/>
        );
    })

    let displayId = level.two_player ? lvl_id.substring(0, lvl_id.length - 3) : lvl_id;
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