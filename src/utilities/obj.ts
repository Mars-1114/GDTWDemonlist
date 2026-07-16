/* ------ RAW DATA ------
 * Used for data fetching
 * ---------------------- */

export interface RawLevel {
    name: string;
    publisher_id: string;
    level_id: string;
    position: number;
    two_player: boolean;
    legacy: boolean;
}

export interface RawRecord {
    url: string;
    date: string;
    id: number; // used for ordering
    is_mobile: boolean;
}

export interface Legacy {
    name: string;
    publisher: string;
}

export interface RawPlayerInfo {
    in_group: boolean;
    contact: {
        facebook?: string;
        youtube?: string;
        discord?: string;
        gd?: {
            icon: string;
            account: string;
        };
    }
}

export type RawLevels = RawLevel[];
export type RawRecords = Record<LevelId, Record<Player, RawRecord>>;
export type Legacies = Record<LevelId, Legacy>;
export type Players = Record<Player, RawPlayerInfo>;

export interface RawData {
    levels: RawLevels;
    records: RawRecords;
    legacies: Legacies;
    players: Players;
}


/* ------- FORMATTED DATA -------
 * Used for internal computation
 * ------------------------------ */

export interface FormattedLevel {
    name: string;
    publisher?: string;
    publisher_id?: string;
    aredl_rank: number;
    local_rank: number;
    points: number;
    two_player: boolean;
    is_legacy: boolean;

    records: Map<Player, RawRecord>;
}

export interface FormattedPlayer {
    points: number;
    rank: number;

    records: Map<LevelId, RawRecord>;
}

export interface ChangelogInfo {
    addition: {
        classical: LevelId[];
        platformer: LevelId[];
    };
    deletion: {
        classical: LevelId[];
        platformer: LevelId[];
    };

    update?: {
        version: string;
        message: string;
    };
}

export type Demonlist = Map<LevelId, FormattedLevel>;
export type Leaderboard = Map<Player, FormattedPlayer>;
export type Changelog = Map<FormattedDate, ChangelogInfo>;


/* ------- ALIASES -------
 * Used for readability
 * ----------------------- */

export type LevelId = string;
export type Player = string;
export type FormattedDate = string;