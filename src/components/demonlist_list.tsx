import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";

type setLvlId = (lvl_id: string) => void;

function DemonlistListUnit({lvlId, lvlDetail, setLvlId}: {lvlId: string, lvlDetail: obj.FormattedLevel, setLvlId: setLvlId}) {
    let rank = !lvlDetail.is_legacy ? <span>#{lvlDetail.local_rank}</span> : null;
    let publisher = lvlDetail.is_ambiguous ? <span>({lvlDetail.publisher})</span> : null;
    let two_player = lvlDetail.two_player ? <span>[2P]</span> : null;
    let points = <span>{lvlDetail.points} pts</span>;

    return (
        <div onClick={() => setLvlId(lvlId)}>
            {rank} {two_player} {lvlDetail.name} {publisher} {points}
        </div>
    );
}

export function DemonlistList({demonlist, setLvlId}: { demonlist: obj.Demonlist, setLvlId: setLvlId }) {
    let rows: JSX.Element[] = [];
    demonlist.forEach((level, lvl_id) => {
        rows.push(
            <DemonlistListUnit key={lvl_id} lvlId={lvl_id} lvlDetail={level} setLvlId={setLvlId} />
        )
    });
    return rows;
}