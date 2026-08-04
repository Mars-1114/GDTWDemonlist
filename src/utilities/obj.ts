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
    nlw_tier: string | null;
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
    division?: string;
    contact: {
        facebook?: string;
        youtube?: string;
        gd?: string;
    }
}

export interface ChangelogInfo {
    addition?: {
        classic?: LevelId[];
        platformer?: LevelId[];
    };
    deletion?: {
        classic?: LevelId[];
        platformer?: LevelId[];
    };

    update?: {
        version: string;
        message: string;
    };
}

export type RawLevels = RawLevel[];
export type RawRecords = Record<LevelId, Record<Player, RawRecord>>;
export type Legacies = Record<LevelId, Legacy>;
export type Players = Record<Player, RawPlayerInfo>;
export type RawChangelogs = Record<FormattedDate, ChangelogInfo>;

export interface RawData {
    levels: {
        classic: RawLevels;
        platformer: RawLevels;
    }
    records: {
        classic: RawRecords;
        platformer: RawRecords;
    }
    legacies: {
        classic: Legacies;
        platformer: Legacies;
    }
    players: Players;
    changelog: RawChangelogs;
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
    difficulty_tier?: string;
    two_player: boolean;
    is_legacy: boolean;
    is_extreme: boolean;
    is_ambiguous: boolean;  // multiple levels with the same name

    records: Map<Player, RawRecord>;
}

export interface FormattedPlayer {
    points: number;
    exd_count: number;
    rank: number;
    is_active: boolean;

    records: Map<LevelId, { index: number; record: RawRecord }>;
}

export type Demonlist = Map<LevelId, FormattedLevel>;
export type Leaderboard = Map<Player, FormattedPlayer>;
export type Changelogs = Map<FormattedDate, ChangelogInfo>;

export interface Data {
    demonlist: {
        classic: Demonlist;
        platformer: Demonlist;
    };
    leaderboard: {
        classic: Leaderboard;
        platformer: Leaderboard;
    };
    players: Players;
    changelogs: Changelogs;
}


/* ------- ALIASES -------
 * Used for readability
 * ----------------------- */

export type LevelId = string;
export type Player = string;
export type FormattedDate = string;

export const OrderType = [
    {id: "difficulty", label: "難度"},
    {id: "alphabet", label: "字母"},
    {id: "time", label: "時間"}
];

export const RankType = [
    {id: "gdtw", label: "台灣"},
    {id: "aredl", label: "全球"},
    {id: "player", label: "個人"}
];

export type Order = (typeof OrderType)[number];
export type Rank = (typeof RankType)[number];

export const TierPalette: Record<string, string> = {
    "Beginner": "#4A86E8",
    "Easy": "#00FFFF",
    "Medium": "#00FF00",
    "Hard": "#FFFF00",
    "Very Hard": "#FF9900",
    "Insane": "#FF0000",
    "Extreme": "#FF00FF",
    "Remorseless": "#9900FF",
    "Relentless": "#B087EB",
    "Terrifying": "#F19EEA",
    "Catastrophic": "#EA6661",
    "Inexorable": "#FFC183",
    "Excruciating": "#FFE599",
    "Merciless": "#A7E58D",
    "Malicious": "#56D7C5",
    "Ludicrous": "#66A6EC",
    "Diabolical": "#7468F2",
    "Disastrous": "#BF56ED",
    "Ridiculous": "#EC4F78",
    "Extended": "#AAAAAA",
    "Main": "#FFFFFF"
};