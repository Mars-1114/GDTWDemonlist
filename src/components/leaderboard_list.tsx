import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";

type setPlayer = (player: string) => void;

function LeaderboardListUnit({player, playerDetail, setPlayer}: {player: string, playerDetail: obj.FormattedPlayer, setPlayer: setPlayer}) {
    return (
        <div onClick={() => setPlayer(player)}>
            #{playerDetail.rank} - {player} [{playerDetail.points} pts]
        </div>
    );
}

export function LeaderboardList({leaderboard, setPlayer}: {leaderboard: obj.Leaderboard, setPlayer: setPlayer}) {
    let rows: JSX.Element[] = [];
    leaderboard.forEach((playerDetail, player) => {
        rows.push(
            <LeaderboardListUnit key={player} player={player} playerDetail={playerDetail} setPlayer={setPlayer} />
        );
    });
    return rows;
}