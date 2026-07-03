export interface LevelRaw {
    name: string;
    publisher_id: string;
    level_id: string;
    position: number;
    two_player: boolean;
    legacy: boolean;
}

export interface LevelRecord {
    url: string;
    date: string;
    id: string; // used for ordering
    is_mobile: boolean;
}

export type RecordsRaw = Record<string, LevelRecord>;

export interface Level extends LevelRaw {
    local_position: number;
    points: number;
    records: RecordsRaw;
}

export type Levels = Record<string, Level>;