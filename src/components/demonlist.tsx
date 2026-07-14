import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";

type setLvlId = (lvl_id: string) => void;

function DemonlistUnit({lvlId, lvlDetail, setLvlId}: {lvlId: string, lvlDetail: obj.FormattedLevel, setLvlId: setLvlId}) {
    return (
        <div onClick={() => setLvlId(lvlId)}>
            #{lvlDetail.local_rank} - {lvlDetail.name} [{lvlDetail.points} pts]
        </div>
    );
}

export function Demonlist({levels, setLvlId}: { levels: obj.Demonlist, setLvlId: setLvlId }) {
    let rows: JSX.Element[] = [];
    levels.forEach((level, lvl_id) => {
        rows.push(
            <DemonlistUnit key={lvl_id} lvlId={lvl_id} lvlDetail={level} setLvlId={setLvlId} />
        )
    });
    return rows;
}