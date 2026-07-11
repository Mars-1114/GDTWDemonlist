import { fetchLevel, fetchRecord, fetchLegacy } from "./fetch_levels";
import * as obj from "./obj";
import { getPoints } from "./compute";


interface LevelInfo {
    name: string;
    id: string;
    position: number;
}

export async function formatLeaderboard(lvl_type: "classic" | "platformer")  {
    let rawLevels = await fetchLevel(lvl_type);
    let rawRecords = await fetchRecord(lvl_type);
    let rawLegacies = await fetchLegacy(lvl_type);

    // aredl rank
    let infos: Record<string, LevelInfo> = {};
    for (const lvl of rawLevels) {
        const lvl_id = lvl.level_id + (lvl.two_player ? "_2p" : "");
        if (lvl_id in rawRecords) {
            infos[lvl_id] = {
                name: lvl.name,
                id: lvl_id,
                position: lvl.position
            };
        }
    }
    let ids = Object.keys(infos);
    ids.sort((a, b) => {
        return infos[a].position - infos[b].position;
    })

    // points
    let pts: Record<string, number> = {};
    let len = ids.length;
    for (let i = 0; i < len; i++) {
        let id = ids[i];
        let rank = infos[id].position;
        pts[id] = getPoints(i + 1, rank, len);
    }

    let rawLeaderboard: obj.UnorderedLeaderboard = {};
    for (const lvl_id in rawRecords) {
        for (const player in rawRecords[lvl_id]) {
            if (!rawLeaderboard[player]) {
                rawLeaderboard[player] = {
                    player: player,
                    points: 0,
                    records: []
                }
            }

            rawLeaderboard[player].records.push([lvl_id, rawRecords[lvl_id][player]]);
            if (lvl_id in pts) {
                rawLeaderboard[player].points += pts[lvl_id];
            }
        }
    }

    // sort levels for all players
    for (let player in rawLeaderboard) {
        rawLeaderboard[player].records.sort((a, b) => {
            let idA = a[0];
            let idB = b[0];
            if (idA in pts && idB in pts) {
                return pts[idB] - pts[idA];
            }
            if (idA in pts) {
                return -1;
            }
            if (idB in pts) {
                return 1;
            }
            return infos[idA].name.localeCompare(idB);
        })
    }

    // sort players
    let leaderboard: obj.Leaderboard = Object.values(rawLeaderboard);
    leaderboard.sort((a, b) => {
        if (a.points != b.points) {
            return b.points - a.points;
        }

        return 1;
    });

    return leaderboard;
}