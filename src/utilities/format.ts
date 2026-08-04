import { getPoints } from "./compute";
import * as obj from "./obj";

function formatRecords(records: Record<obj.Player, obj.RawRecord>) {
    let levelRecords = new Map<obj.Player, obj.RawRecord>();
    for (const player in records) {
        levelRecords.set(player, records[player]);
    }
    levelRecords = new Map([...levelRecords].sort((a, b) => {
        let dateA = Date.parse(a[1].date);
        let dateB = Date.parse(b[1].date);
        if (dateA != dateB)
            return dateA - dateB;
        return a[1].id - b[1].id;
    }));

    return levelRecords;
}

export function formatDemonlist(raw_levels: obj.RawLevels, raw_records: obj.RawRecords, legacies: obj.Legacies) {
    let demonlist: obj.Demonlist = new Map();
    let count = 0;
    for (const lvl of raw_levels) {
        const lvl_id = lvl.level_id + (lvl.two_player ? "_2p" : "");
        if (!(lvl_id in raw_records) && !(lvl_id in legacies))
            continue;
        if (!lvl.legacy && !(lvl_id in legacies))
            ++count;

        // extract name (format: "{name} ({publisher})")
        let [, name, publisher]: (string | undefined)[] = lvl.name.match(/^([^(]+?)(?:\s*\(([^)]+)\))?$/) || [];
        if (publisher == "2P") publisher = undefined;

        let tier = lvl.nlw_tier ? lvl.nlw_tier : undefined;
        if (!lvl.nlw_tier && lvl.position <= 75)
            tier = "Main";
        else if (!lvl.nlw_tier && lvl.position <= 150)
            tier = "Extended";
        if (lvl.legacy || lvl.nlw_tier == "Fuck")
            tier = undefined;

        demonlist.set(lvl_id, {
            name: name,
            publisher: publisher,
            publisher_id: lvl.publisher_id,
            aredl_rank: lvl.position,
            local_rank: !lvl.legacy ? count : -1,
            difficulty_tier: tier,
            points: 0,
            two_player: lvl.two_player,
            is_legacy: lvl.legacy || lvl_id in legacies,
            is_extreme: !lvl.legacy,
            is_ambiguous: publisher != undefined,

            records: formatRecords(raw_records[lvl_id]),
        });
    }

    // assign points & tiers
    let lvl_tiers = [...demonlist.values()].map(lvl => lvl.difficulty_tier);
    let idx = 0;
    demonlist.forEach((lvl, lvl_id) => {
        ++idx;
        let tier = lvl.difficulty_tier || !lvl.is_extreme ? lvl.difficulty_tier : estimateTier(lvl_tiers.slice(idx - 5, idx + 5));
        demonlist.set(lvl_id, {
            ...lvl,
            points: !lvl.is_legacy ? getPoints(lvl.local_rank, lvl.aredl_rank, count) : 0,
            difficulty_tier: tier,
        });
    });

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
            is_extreme: false,
            is_ambiguous: false,

            records: formatRecords(raw_records[lvl_id])
        });
    }

    demonlist = new Map([...demonlist].sort((a, b) => {
        if (a[1].points > 0 || b[1].points > 0)
            return b[1].points - a[1].points;
        if (!a[1].difficulty_tier && !b[1].difficulty_tier)
            return a[1].name.localeCompare(b[1].name);
        if (!a[1].difficulty_tier)
            return -1;
        if (!b[1].difficulty_tier)
            return 1;
        return a[1].aredl_rank - b[1].aredl_rank;
    }));
    return demonlist;
}

export function formatLeaderboard(demonlist: obj.Demonlist) {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    const oneYearAgo = d.getTime();

    let rawLeaderboard: Record<obj.Player, obj.FormattedPlayer> = {};
    demonlist.forEach((lvl, lvl_id) => {
        lvl.records.forEach((record, player) => {
            if (!(player in rawLeaderboard)) {
                rawLeaderboard[player] = {
                    points: 0,
                    exd_count: 0,
                    rank: 0,
                    is_active: false,
                    records: new Map()
                };
            }

            const lvlDetail = demonlist.get(lvl_id)!;
            rawLeaderboard[player].records.set(lvl_id, {index: rawLeaderboard[player].records.size + 1, record: record});
            rawLeaderboard[player].points += lvlDetail.points;
            if (!lvlDetail.is_legacy)
                rawLeaderboard[player].exd_count++;
            if (Date.parse(record.date) >= oneYearAgo)
                rawLeaderboard[player].is_active = true;
        });
    });

    return rankLeaderboard(rawLeaderboard, demonlist);
}

export function rankLeaderboard(rawLeaderboard: Record<obj.Player, obj.FormattedPlayer>, demonlist: obj.Demonlist) {
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

        let hardestRecordA = detailA.records.values().next().value!;
        let hardestRecordB = detailB.records.values().next().value!;
        let hardestRecordDateA = Date.parse(hardestRecordA.record.date);
        let hardestRecordDateB = Date.parse(hardestRecordB.record.date);
        if (hardestRecordDateA != hardestRecordDateB)
            return hardestRecordDateA - hardestRecordDateB;

        let hardestRecordIdA = detailA.records.values().next().value!.record.id;
        let hardestRecordIdB = detailB.records.values().next().value!.record.id;
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
            addition: info.addition ? {
                classic: info.addition.classic ? replaceIdWithName(info.addition.classic, classical_demonlist) : undefined,
                platformer: info.addition.platformer ? replaceIdWithName(info.addition.platformer, platformer_demonlist) : undefined
            } : undefined,
            deletion: info.deletion ? {
                classic: info.deletion.classic ? replaceIdWithName(info.deletion.classic, classical_demonlist) : undefined,
                platformer: info.deletion.platformer ? replaceIdWithName(info.deletion.platformer, platformer_demonlist) : undefined
            } : undefined
        });
    }
    return formatted_changelog;
}

function estimateTier(neighbors: (string | undefined)[]): string | undefined {
    let bins: Record<string, number> = {};
    for (const neighbor of neighbors) {
        if (!neighbor || neighbor == "Main" || neighbor == "Extended")
            continue;
        if (neighbor in bins)
            bins[neighbor]++;
        else
            bins[neighbor] = 1;
    }
    if (Object.keys(bins).length == 0)
        return undefined;
    return Object.keys(bins).reduce((a, b) => bins[a] > bins[b] ? a : b);
}