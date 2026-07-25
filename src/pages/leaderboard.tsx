import { useState } from "react";
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
    const [player, setPlayer] = useState<string>(leaderboard.keys().next().value!);

    return (
        <div style={{display: "flex", flexDirection: "row", height: "500px"}}>
            <div style={{flex: 1, overflowY: "scroll"}}>
                <LeaderboardList leaderboard={leaderboard} setPlayer={setPlayer} />
            </div>
            <div style={{flex: 1}}>
                <LeaderboardDetail player={player} playerDetail={leaderboard.get(player)!} playerInfo={data.players[player]} demonlist={demonlist} />
            </div>
        </div>
    );
}