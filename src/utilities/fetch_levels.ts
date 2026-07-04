import * as obj from "./obj"

export async function fetchLevel(lvl_type: "classic" | "platformer"): Promise<obj.LevelRaw[]> {
    let list = (lvl_type === "classic") ? "aredl" : "arepl";
    const response = await fetch(`https://api.aredl.net/v2/api/${list}/levels?exclude_legacy=true`);
    return await response.json();
}

export async function fetchRecord(lvl_type: "classic" | "platformer"): Promise<obj.Records> {
    const response = await fetch(`../../data/${lvl_type}-records.json`);
    return await response.json();
}