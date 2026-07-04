import { fetchLevel, fetchRecord } from "./fetch_levels";
import * as obj from "./obj"
import { getPoints } from "./compute"

export async function formatLevel(lvl_type: "classic" | "platformer") {
    let rawLevels = await fetchLevel(lvl_type);
    let records = await fetchRecord(lvl_type);

    let formattedRecords: obj.Levels;
    let count = 0;

    for (const lvl of rawLevels) {
        const lvl_id = lvl.level_id + (lvl.two_player ? "_2p" : "");
        if (lvl_id in records) {
            ++count;
            formattedRecords[lvl_id] = {
                ...lvl,
                local_position: count,
                points: 0,  // placeholder
                records: records[lvl_id]
            };
        }
    }

    // assign points
    for (let lvl_id in formattedRecords) {
        let lvl = formattedRecords[lvl_id];
        lvl.points = getPoints(lvl.local_position, lvl.position, count);
    }

    return formattedRecords;
}