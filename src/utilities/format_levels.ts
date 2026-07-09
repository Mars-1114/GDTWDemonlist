import { fetchLevel, fetchRecord } from "./fetch_levels";
import * as obj from "./obj"
import { getPoints } from "./compute"

export async function formatLevel(lvl_type: "classic" | "platformer") {
    let rawLevels = await fetchLevel(lvl_type);
    let records = await fetchRecord(lvl_type);

    let formattedRecords: obj.OrderedLevels = [];
    let count = 0;

    for (const lvl of rawLevels) {
        const lvl_id = lvl.level_id + (lvl.two_player ? "_2p" : "");
        if (lvl_id in records) {
            ++count;
            let levelDetail: obj.Level = {
                ...lvl,
                local_id: lvl_id,
                local_position: count,
                points: 0,  // placeholder
                records: []
            };
            for (const player in records[lvl_id]) {
                levelDetail.records.push(
                    {
                        ...records[lvl_id][player],
                        player: player
                    }
                );
            }
            levelDetail.records.sort((a, b) => {
                let aDate = Date.parse(a.date);
                let bDate = Date.parse(b.date);
                if (aDate != bDate) {
                    return aDate - bDate;
                }
                return a.id - b.id;
            });

            formattedRecords.push(levelDetail);
        }
    }

    // assign points
    for (const lvl_id in formattedRecords) {
        let lvl = formattedRecords[lvl_id];
        lvl.points = getPoints(lvl.local_position, lvl.position, count);
    }

    formattedRecords.sort((a, b) => b.points - a.points);
    return formattedRecords;
}