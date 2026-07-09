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

export interface LevelRecord extends record {
    player: string;
}

export interface Level extends LevelRaw {
    local_id: string;
    local_position: number; // GDTW position
    points: number;
    records: OrderedRecord;
}

export type Leaderboard = Level[]

export type Levels = Record<string, Level>;  // lvl_id: detail
export type Records = Record<string, Record<string, record>>;  // lvl_id: player: record
export type OrderedLevels = Level[]
export type OrderedRecord = LevelRecord[];