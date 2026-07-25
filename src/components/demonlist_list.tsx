import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";

interface DemonlistListUnitProps {
    lvlId: string;
    lvlDetail: obj.FormattedLevel;
    setLvlId: (lvlId: string) => void;
}

interface DemonlistListProps {
    demonlist: obj.Demonlist;
    setLvlId: (lvl_id: string) => void;
    filterText: string;
}

function DemonlistListUnit({lvlId, lvlDetail, setLvlId}: DemonlistListUnitProps) {
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

export function DemonlistList({demonlist, setLvlId, filterText}: DemonlistListProps) {
    let rows: JSX.Element[] = [];
    demonlist.forEach((level, lvl_id) => {
        if (filterText != "" && !level.name.toLowerCase().includes(filterText.toLowerCase())) return;
        rows.push(
            <DemonlistListUnit key={lvl_id} lvlId={lvl_id} lvlDetail={level} setLvlId={setLvlId} />
        )
    });
    return rows;
}