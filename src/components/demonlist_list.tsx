import type { JSX } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import * as obj from "../utilities/obj";

interface DemonlistListProps {
    rawDemonlist: obj.Demonlist;
    refDemonlist: obj.Demonlist;
    viewLvlId: string;
    setDemonlist: (demonlist: obj.Demonlist) => void;
    setLvlId: (lvl_id: string) => void;
    filterText: string;
}

interface DemonlistListUnitProps {
    rank: number;
    lvlId: string;
    lvlDetail: obj.FormattedLevel;
    setLvlId: (lvlId: string) => void;
}

function DemonlistListUnit({rank, lvlId, lvlDetail, setLvlId}: DemonlistListUnitProps) {
    let displayRank = !lvlDetail.is_legacy ? <span>#{rank}</span> : null;
    let publisher = lvlDetail.is_ambiguous ? <span>({lvlDetail.publisher})</span> : null;
    let two_player = lvlDetail.two_player ? <span>[2P]</span> : null;
    let points = <span>{lvlDetail.points} pts</span>;

    return (
        <div onClick={() => setLvlId(lvlId)}>
            {displayRank} {two_player} {lvlDetail.name} {publisher} {points}
        </div>
    );
}

export function DemonlistList({rawDemonlist, refDemonlist, viewLvlId, setDemonlist, setLvlId, filterText}: DemonlistListProps) {
    let rows: JSX.Element[] = [];
    const [filterMobile, setFilterMobile] = useState<boolean>(false);

    useEffect(() => {
        let filteredDemonlist = formatFilteredDemonlist(rawDemonlist, filterMobile);
        if (!filteredDemonlist.has(viewLvlId))
            setLvlId(filteredDemonlist.keys().next().value!);
        setDemonlist(filteredDemonlist);
    }, [filterMobile]);

    let count = 0;
    refDemonlist.forEach((level, lvl_id) => {
        if (filterText != "" && !level.name.toLowerCase().includes(filterText.toLowerCase()))
            return;
        rows.push(
            <DemonlistListUnit key={lvl_id} rank={++count} lvlId={lvl_id} lvlDetail={level} setLvlId={setLvlId} />
        )
    });
    return <div>
        <label>手機通關</label>
        <input type="checkbox" defaultChecked={filterMobile} onClick={() => setFilterMobile(!filterMobile)} />
        {rows}
    </div>;
}

function formatFilteredDemonlist(rawDemonlist: obj.Demonlist, filterMobile: boolean) {
    if (!filterMobile)
        return rawDemonlist;
    let filteredDemonlist: obj.Demonlist = new Map();
    rawDemonlist.forEach((lvlDetail, lvlId) => {
        let records: Map<string, obj.RawRecord> = new Map();
        lvlDetail.records.forEach((record, player) => {
           if (!record.is_mobile)
               return;
           records.set(player, record);
        });
        if (records.size == 0)
            return;
        filteredDemonlist.set(lvlId, {
            ...lvlDetail,
           records: records
        });
    });
    return filteredDemonlist;
}