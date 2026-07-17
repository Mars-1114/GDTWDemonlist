import { useState } from "react";
import * as obj from "../utilities/obj";
import {Leaderboard} from "../components/leaderboard.tsx";
import {LeaderboardDetail} from "../components/leaderboard_detail.tsx";

export function ClassicLeaderboard({data}: {data: obj.Data}) {
    const [player, setPlayer] = useState<string>(data.leaderboard.classic.keys().next().value!);

    return (
        <div style={{display: "flex", flexDirection: "row", height: "500px"}}>
            <div style={{flex: 1, overflowY: "scroll"}}>
                <Leaderboard leaderboard={data.leaderboard.classic} setPlayer={setPlayer} />
            </div>
            <div style={{flex: 1}}>
                <LeaderboardDetail player={player} playerDetail={data.leaderboard.classic.get(player)!} demonlist={data.demonlist.classic} />
            </div>
        </div>
    );
}