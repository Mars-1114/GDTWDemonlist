import { useState } from "react";
import { useImmer } from "use-immer";

import * as obj from "../utilities/obj";
import {LeaderboardList} from "../components/leaderboard_list.tsx";
import {LeaderboardDetail} from "../components/leaderboard_detail.tsx";

interface LeaderboardProps {
    data: obj.Data;
    listType: "classic" | "platformer";
}

export function LeaderboardPage({data, listType}: LeaderboardProps) {
    const demonlist = listType === "classic" ? data.demonlist.classic : data.demonlist.platformer;
    const leaderboard = listType === "classic" ? data.leaderboard.classic : data.leaderboard.platformer;
    const [viewPlayer, setViewPlayer] = useState<string>(leaderboard.keys().next().value!);
    const [filteredLeaderboard, setFilteredLeaderboard] = useImmer(leaderboard);

    return (
        <div style={{display: "flex", flexDirection: "row", height: "500px"}}>
            <div style={{flex: 1, overflowY: "scroll"}}>
                <LeaderboardList
                    demonlist={demonlist}
                    rawLeaderboard={leaderboard}
                    refLeaderboard={filteredLeaderboard}
                    setLeaderboard={setFilteredLeaderboard}
                    setPlayer={setViewPlayer}
                />
            </div>
            <div style={{flex: 1}}>
                <LeaderboardDetail player={viewPlayer} playerDetail={filteredLeaderboard.get(viewPlayer)!} playerInfo={data.players[viewPlayer]} demonlist={demonlist} />
            </div>
        </div>
    );
}