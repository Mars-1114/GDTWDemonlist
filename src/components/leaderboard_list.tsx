import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";

interface LeaderboardListProps {
    leaderboard: obj.Leaderboard;
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

export function LeaderboardList({leaderboard, setPlayer}: LeaderboardListProps) {
    let rows: JSX.Element[] = [];
    leaderboard.forEach((playerDetail, player) => {
        rows.push(
            <LeaderboardListUnit key={player} player={player} playerDetail={playerDetail} setPlayer={setPlayer} />
        );
    });
    return rows;
}