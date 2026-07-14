import classicRecords from "../data/classic-records.json";
import classicLegacy from "../data/classic-legacy.json";
import players from "../data/players.json";
import * as obj from "./obj"

async function fetchLevel(lvl_type: "classic" | "platformer"): Promise<obj.RawLevels> {
    let list = (lvl_type === "classic") ? "aredl" : "arepl";
    const response = await fetch(`https://api.aredl.net/v2/api/${list}/levels?exclude_legacy=true`);
    return await response.json();
}

function fetchRecord(lvl_type: "classic" | "platformer"): obj.RawRecords {
    if (lvl_type === "classic") {
        return classicRecords as obj.RawRecords;
    }

    return {};
}

function fetchLegacy(lvl_type: "classic" | "platformer"): obj.Legacies {
    if (lvl_type === "classic") {
        return classicLegacy as obj.Legacies;
    }

    return {};
}

export async function fetchAll(lvl_type: "classic" | "platformer"): Promise<obj.RawData> {
    let rawLevels = await fetchLevel(lvl_type);
    rawLevels.sort((a, b) => a.position - b.position);  // ensure ordering
    return {
        levels: rawLevels,
        records: fetchRecord(lvl_type),
        legacies: fetchLegacy(lvl_type),
        players: players
    }
}