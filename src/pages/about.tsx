import { Changelog } from "../components/changelog";
import * as obj from "../utilities/obj";

interface AboutProps {
    data: obj.Data;
}

export function About({data}: AboutProps) {
    let demonlistClassic = data.demonlist.classic;
    let demonlistPlatformer = data.demonlist.platformer;
    let leaderboardClassic = data.leaderboard.classic;
    let leaderboardPlatformer = data.leaderboard.platformer;
    let changelogs = data.changelogs;

    let recordCount = 0;
    let extremeCount = 0;
    let playerCount = 0;
    let players: obj.Player[] = [];

    demonlistClassic.forEach((levelDetail) => {
        if (!levelDetail.is_legacy)
            extremeCount++;
        levelDetail.records.forEach(() => {
            recordCount++;
        });
    })
    demonlistPlatformer.forEach((levelDetail) => {
       if (!levelDetail.is_legacy)
           extremeCount++;
       levelDetail.records.forEach(() => {
           recordCount++;
       });
    });
    for (const player of leaderboardClassic.keys()) {
        if (players.includes(player))
            continue;
        playerCount++;
        players.push(player);
    }
    for (const player of leaderboardPlatformer.keys()) {
        if (players.includes(player))
            continue;
        playerCount++;
        players.push(player);
    }

    return (
        <>
            <div>
                <h2>{recordCount}筆記錄，{playerCount}位玩家，{extremeCount}個關卡</h2>
            </div>
            <div>
                <Changelog changelogList={changelogs} />
            </div>
        </>
    );
}