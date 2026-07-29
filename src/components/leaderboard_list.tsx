import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";
import {rankLeaderboard} from "../utilities/format.ts";

import {useEffect, useState} from "react";

interface LeaderboardListProps {
    demonlist: obj.Demonlist;
    rawLeaderboard: obj.Leaderboard;
    refLeaderboard: obj.Leaderboard;
    setLeaderboard: (leaderboard: obj.Leaderboard) => void;
    setPlayer: (player: string) => void;
}
interface LeaderboardListUnitProps {
    player: string;
    playerDetail: obj.FormattedPlayer;
    setPlayer: (player: string) => void;
}

function LeaderboardListUnit({player, playerDetail, setPlayer}: LeaderboardListUnitProps) {
    let rank = playerDetail.points != 0 ? <span>#{playerDetail.rank}</span> : null;
    let points = playerDetail.points != 0 ? <span>{playerDetail.points} pts</span> : null;

    return (
        <div onClick={() => setPlayer(player)}>
            {rank} {player} {points}
        </div>
    );
}

export function LeaderboardList({demonlist, rawLeaderboard, refLeaderboard, setLeaderboard, setPlayer}: LeaderboardListProps) {
    let rows: JSX.Element[] = [];
    const [filterActive, setFilterActive] = useState<boolean>(false);
    const [filterMobile, setFilterMobile] = useState<boolean>(false);

    useEffect(() => {
        setLeaderboard(formatFilteredLeaderboard(rawLeaderboard, demonlist, filterActive, filterMobile));
    }, [filterActive, filterMobile]);

    refLeaderboard.forEach((playerDetail, player) => {
        if (filterActive && !playerDetail.is_active)
            return;
        rows.push(
            <LeaderboardListUnit
                key={player}
                player={player}
                playerDetail={playerDetail}
                setPlayer={setPlayer}
            />
        );
    });
    return <>
        <div>
            <label>活躍玩家</label>
            <input type="checkbox" checked={filterActive} onClick={() => setFilterActive(!filterActive)} />
            <label>手機通關</label>
            <input type="checkbox" checked={filterMobile} onClick={() => setFilterMobile(!filterMobile)} />
        </div>
        {rows}
    </>;
}

function formatFilteredLeaderboard(leaderboard: obj.Leaderboard, demonlist: obj.Demonlist, filterActive: boolean, filterMobile: boolean): obj.Leaderboard {
    let rawFilteredLeaderboard: Record<obj.Player, obj.FormattedPlayer> = {};
    leaderboard.forEach((playerDetail, player) => {
        if (filterActive && !playerDetail.is_active)
            return;
        let filteredRecords: Map<string, { index: number , record: obj.RawRecord }> = new Map();
        let count = 0;
        let points = 0;
        playerDetail.records.forEach((record, lvlId) => {
            if (filterMobile && !record.record.is_mobile)
                return;
            if (!demonlist.get(lvlId)!.is_legacy) {
                count++;
                points += demonlist.get(lvlId)!.points;
            }
            filteredRecords.set(lvlId, {
                index: filteredRecords.size + 1,
                record: record.record
            });
        });
        if (count == 0)
            return;
        rawFilteredLeaderboard[player] = {
            rank: -1,
            exd_count: count,
            points: Number(points.toFixed(2)),
            is_active: playerDetail.is_active,
            records: filteredRecords
        };
    });

    return rankLeaderboard(rawFilteredLeaderboard, demonlist);
}