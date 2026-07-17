import classicRecords from "../data/classic-records.json";
import classicLegacy from "../data/classic-legacy.json";
import platformerRecords from "../data/platformer-records.json";
import platformerLegacy from "../data/platformer-legacy.json";
import players from "../data/players.json";
import changelog from "../data/changelog.json";

import * as obj from "./obj"

async function fetchLevel(lvl_type: "classic" | "platformer"): Promise<obj.RawLevels> {
    let list = (lvl_type === "classic") ? "aredl" : "arepl";
    const response = await fetch(`https://api.aredl.net/v2/api/${list}/levels?exclude_legacy=true`);
    return await response.json();
}

export async function fetchAll(): Promise<obj.RawData | null> {
    try {
        let rawClassicLevels = await fetchLevel("classic");
        let rawPlatformerLevels = await fetchLevel("platformer");
        rawClassicLevels.sort((a, b) => a.position - b.position);  // ensure ordering
        rawPlatformerLevels.sort((a, b) => a.position - b.position);  // ensure ordering
        return {
            levels: {
                classic: rawClassicLevels,
                platformer: rawPlatformerLevels,
            },
            records: {
                classic: classicRecords as obj.RawRecords,
                platformer: platformerRecords as obj.RawRecords
            },
            legacies: {
                classic: classicLegacy as obj.Legacies,
                platformer: platformerLegacy as obj.Legacies
            },
            players: players,
            changelog: changelog as obj.RawChangelogs
        }
    }
    catch (error) {
        console.log("Failed to fetch levels: ", error);
        return null;
    }
}