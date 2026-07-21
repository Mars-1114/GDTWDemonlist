import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";

type setPlayer = (player: string) => void;

function LeaderboardListUnit({player, playerDetail, setPlayer}: {player: string, playerDetail: obj.FormattedPlayer, setPlayer: setPlayer}) {
    let rank = playerDetail.points != 0 ? <span>#{playerDetail.rank}</span> : null;
    let points = playerDetail.points != 0 ? <span>{playerDetail.points} pts</span> : null;

    return (
        <div onClick={() => setPlayer(player)}>
            {rank} {player} {points}
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