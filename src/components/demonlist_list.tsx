import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";

type setLvlId = (lvl_id: string) => void;

function DemonlistListUnit({lvlId, lvlDetail, setLvlId}: {lvlId: string, lvlDetail: obj.FormattedLevel, setLvlId: setLvlId}) {
    return (
        <div onClick={() => setLvlId(lvlId)}>
            #{lvlDetail.local_rank} - {lvlDetail.name} [{lvlDetail.points} pts]
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