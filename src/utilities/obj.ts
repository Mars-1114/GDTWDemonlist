export interface LevelRaw {
    name: string;
    publisher_id: string;
    level_id: string;
    position: number;
    two_player: boolean;
}

export interface record {
    url: string;
    date: string;
    id: number; // used for ordering
    is_mobile: boolean;
}

export type LevelRecord = Record<string, record>; // player: record

export type Records = Record<string, LevelRecord>;  // lvl_id: record

export interface Level extends LevelRaw {
    local_position: number; // GDTW position
    points: number;
    records: LevelRecord;
}

export type Levels = Record<string, Level>;  // lvl_id: detail