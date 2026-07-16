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

export function formatDemonlist(raw_data: obj.RawData) {
    const rawLevels = raw_data.levels;
    const legacies = raw_data.legacies;
    const rawRecords = raw_data.records;

    let demonlist: obj.Demonlist = new Map();
    let count = 0;
    for (const lvl of rawLevels) {
        const lvl_id = lvl.level_id + (lvl.two_player ? "_2p" : "");
        if (!(lvl_id in rawRecords))
            continue;
        ++count;

        demonlist.set(lvl_id, {
            name: lvl.name,
            publisher_id: lvl.publisher_id,
            aredl_rank: lvl.position,
            local_rank: count,
            points: 0,
            two_player: lvl.two_player,
            is_legacy: false,
            records: formatRecords(rawRecords[lvl_id])
        });
    }

    // assign points
    demonlist.forEach((lvl, lvl_id) => {
        demonlist.set(lvl_id, {
            ...lvl,
            points: getPoints(lvl.local_rank, lvl.aredl_rank, count)
        });
    })

    // legacy
    for (const lvl_id in legacies) {
        demonlist.set(lvl_id, {
            name: legacies[lvl_id].name,
            publisher: legacies[lvl_id].publisher,
            aredl_rank: -1,
            local_rank: -1,
            points: 0,
            two_player: false,
            is_legacy: true,
            records: formatRecords(rawRecords[lvl_id])
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
                  rank: 0,
                  records: new Map()
                };
            }
            rawLeaderboard[player].records.set(lvl_id, record);
            rawLeaderboard[player].points += demonlist.get(lvl_id)!.points;
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

// TODO: Complete rewrite after I figure out how to parse the raw changelog page
export function formatChangelog(demonlist: obj.Demonlist): obj.Changelog {
    let firstCompletionDate: Record<obj.LevelId, obj.FormattedDate> = {};
    demonlist.forEach((lvl, lvl_id) => {
        let records = [...lvl.records.values()];
        if (records.length == 0) return;

        records.sort((a, b) => {
            let dateA = Date.parse(a.date);
            let dateB = Date.parse(b.date);
            return dateA - dateB;
        });
        firstCompletionDate[lvl_id] = records[0].date;
    });

    let rawChangelogList: Record<obj.LevelId, obj.ChangelogInfo> = {};
    for (const lvl_id in firstCompletionDate) {
        let date = firstCompletionDate[lvl_id];
        if (!(date in rawChangelogList)) {
            rawChangelogList[date] = {
                addition: {
                    classical: [],
                    platformer: []
                },
                deletion: {
                    classical: [],
                    platformer: []
                }
            };
        }

        rawChangelogList[date].addition.classical.push(lvl_id);
    }

    // sort
    for (const date in rawChangelogList) {
        rawChangelogList[date].addition.classical.sort((a, b) => {
            let ptsA = demonlist.get(a)!.points;
            let ptsB = demonlist.get(b)!.points;

            if (ptsA != ptsB)
                return ptsB - ptsA;

            let nameA = demonlist.get(a)!.name;
            let nameB = demonlist.get(b)!.name;
            return nameA.localeCompare(nameB);
        });

        // swap lvl_id with name
        let len = rawChangelogList[date].addition.classical.length;
        for (let i = 0; i < len; i++) {
            let lvl_id = rawChangelogList[date].addition.classical[i];
            rawChangelogList[date].addition.classical[i] = demonlist.get(lvl_id)!.name;
        }
    }
    return new Map(Object.entries(rawChangelogList).sort((a, b) => {
        return Date.parse(a[0]) - Date.parse(b[0]);
    }));
}