import { fetchLevel, fetchRecord } from "./fetch_levels.ts";

export async function formatLevel(lvl_type: "classic" | "platformer") {
    let rawLevels = await fetchLevel(lvl_type);
    let rawRecords = await fetchRecord(lvl_type);
    for (const lvl of rawLevels) {
        const lvl_id = lvl.level_id + (lvl.two_player ? "_2p" : "");
        if (lvl_id in rawRecords) {

        }
    }
}