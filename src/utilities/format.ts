import { getPoints } from "./compute";
import * as obj from "./obj";

function formatRecords(records: Record<obj.Player, obj.RawRecord>) {
    let levelRecords = new Map<obj.Player, obj.RawRecord>();
    for (const player in records) {
        levelRecords.set(player, records[player]);
    }
    levelRecords = new Map([...levelRecords].sort((a, b) => {
        return a[1].id - b[1].id;
    }));

    return levelRecords;
}

export function formatDemonlist(raw_levels: obj.RawLevels, raw_records: obj.RawRecords, legacies: obj.Legacies) {
    let demonlist: obj.Demonlist = new Map();
    let count = 0;
    for (const lvl of raw_levels) {
        const lvl_id = lvl.level_id + (lvl.two_player ? "_2p" : "");
        if (!(lvl_id in raw_records))
            continue;
        if (!lvl.legacy)
            ++count;

        // extract name
        let [, name, publisher]: string[] | undefined[] = lvl.name.match(/^([^(]+?)(?:\s*\(([^)]+)\))?$/) || [];
        if (publisher == "2P") publisher = undefined;

        demonlist.set(lvl_id, {
            name: name,
            publisher: publisher,
            publisher_id: lvl.publisher_id,
            aredl_rank: lvl.position,
            local_rank: !lvl.legacy ? count : -1,
            points: 0,
            two_player: lvl.two_player,
            is_legacy: lvl.legacy,
            is_ambiguous: publisher != undefined,

            records: formatRecords(raw_records[lvl_id]),
        });
    }

    // assign points
    demonlist.forEach((lvl, lvl_id) => {
        demonlist.set(lvl_id, {
            ...lvl,
            points: !lvl.is_legacy ? getPoints(lvl.local_rank, lvl.aredl_rank, count) : 0
        });
    })

    // legacy
    for (const lvl_id in legacies) {
        if (demonlist.has(lvl_id))
            continue;
        demonlist.set(lvl_id, {
            name: legacies[lvl_id].name,
            publisher: legacies[lvl_id].publisher,
            aredl_rank: -1,
            local_rank: -1,
            points: 0,
            two_player: false,
            is_legacy: true,
            is_ambiguous: false,

            records: formatRecords(raw_records[lvl_id])
        });
    }

    demonlist = new Map([...demonlist].sort((a, b) => {
        if (a[1].points > 0 || b[1].points > 0)
            return b[1].points - a[1].points;
        return a[1].name.localeCompare(b[1].name);
    }));
    return demonlist;
}

export function formatLeaderboard(demonlist: obj.Demonlist) {
    let rawLeaderboard: Record<obj.Player, obj.FormattedPlayer> = {};
    demonlist.forEach((lvl, lvl_id) => {
        lvl.records.forEach((record, player) => {
            if (!(player in rawLeaderboard)) {
                rawLeaderboard[player] = {
                    points: 0,
                    exd_count: 0,
                    rank: 0,
                    records: new Map()
                };
            }

            const lvlDetail = demonlist.get(lvl_id)!;
            rawLeaderboard[player].records.set(lvl_id, record);
            rawLeaderboard[player].points += lvlDetail.points;
            if (!lvlDetail.is_legacy)
                rawLeaderboard[player].exd_count++;
        });
    });

    let leaderboard: obj.Leaderboard = new Map(Object.entries(rawLeaderboard).sort((a, b) => {
        let playerA = a[0], playerB = b[0];
        let detailA = a[1], detailB = b[1];
        if (detailA.points != detailB.points)
            return detailB.points - detailA.points;

        let hardestPointsA = demonlist.get(detailA.records.keys().next().value!)!.points;
        let hardestPointsB = demonlist.get(detailB.records.keys().next().value!)!.points;
        if (hardestPointsA != hardestPointsB)
            return hardestPointsB - hardestPointsA;

        if (hardestPointsA == 0)
            return playerA.localeCompare(playerB);

        let hardestRecordIdA = detailA.records.values().next().value!.id;
        let hardestRecordIdB = detailB.records.values().next().value!.id;
        return hardestRecordIdA - hardestRecordIdB;
    }));

    let rank = 0;
    leaderboard.forEach((detail, player) => {
        ++rank;
        leaderboard.set(player, {
            ...detail,
            rank: rank,
            points: Number(detail.points.toFixed(2))
        });
    });

    return leaderboard;
}

function replaceIdWithName(ids: string[], demonlist: obj.Demonlist) {
    let result = [...ids];
    result.sort((a, b) => {
        try {
            let ptsA = demonlist.get(a)!.points;
            let ptsB = demonlist.get(b)!.points;
            if (ptsA != ptsB)
                return ptsB - ptsA;

            let nameA = demonlist.get(a)!.name;
            let nameB = demonlist.get(b)!.name;
            return nameA.localeCompare(nameB);
        }
        catch (error) {
            console.log("Error getting ID of", a, "or", b);
            return -1;
        }
    });

    for (let i = 0; i < result.length; i++) {
        try {
            result[i] = demonlist.get(result[i])!.name;
        }
        catch (error) {
            console.log("Cannot find level name of ID", ids[i]);
        }
    }
    return result;
}

export function formatChangelog(raw_changelog: obj.RawChangelogs, classical_demonlist: obj.Demonlist, platformer_demonlist: obj.Demonlist): obj.Changelogs {
    let formatted_changelog: obj.Changelogs = new Map();
    for (const date in raw_changelog) {
        let info = raw_changelog[date];
        formatted_changelog.set(date, {
            ...info,
            addition: {
                classic: replaceIdWithName(info.addition.classic, classical_demonlist),
                platformer: replaceIdWithName(info.addition.platformer, platformer_demonlist)
            },
            deletion: {
                classic: replaceIdWithName(info.deletion.classic, classical_demonlist),
                platformer: replaceIdWithName(info.deletion.platformer, platformer_demonlist)
            }
        });
    }
    return formatted_changelog;
}