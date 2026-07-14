import { useState, useEffect } from "react";
import * as obj from "../utilities/obj";
import {Leaderboard} from "../components/leaderboard.tsx";
import {LeaderboardDetail} from "../components/leaderboard_detail.tsx";

export function ClassicLeaderboard({leaderboard, demonlist, loading}: {leaderboard: obj.Leaderboard | null, demonlist: obj.Demonlist, loading: boolean}) {
    const [player, setPlayer] = useState<string>(leaderboard != null ? leaderboard.keys().next().value! : "");

    useEffect(() => {
        if (leaderboard == null) return;
        setPlayer(leaderboard.keys().next().value!);
    }, [leaderboard]);

    if (loading) {
        return <div>Loading Leaderboard...</div>;
    }
    if (leaderboard == null) {
        return (
            <div>No players found :(</div>
        );
    }

    return (
        <div style={{display: "flex", flexDirection: "row", height: "500px"}}>
            <div style={{flex: 1, overflowY: "scroll"}}>
                <Leaderboard leaderboard={leaderboard} setPlayer={setPlayer} />
            </div>
            <div style={{flex: 1}}>
                <LeaderboardDetail player={player} playerDetail={leaderboard.get(player)!} demonlist={demonlist} />
            </div>
        </div>
    );
}