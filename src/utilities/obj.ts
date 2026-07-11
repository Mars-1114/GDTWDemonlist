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

export interface Level extends LevelRaw {
    local_id: string;
    local_position: number; // GDTW position
    points: number;
    records: [string, record][]; // [player, record]
}

export interface LegacyLevel {
    id: string;
    publisher: string;
}

export interface LeaderboardPlayer {
    player: string;
    points: number;
    records: [string, record][]; // [lvl_name, record]
}
export type UnorderedLeaderboard = Record<string, LeaderboardPlayer>;  // player: leaderboard
export type Leaderboard = LeaderboardPlayer[];

export type Records = Record<string, Record<string, record>>;  // lvl_id: player: record
export type OrderedLevels = Level[];

export type Legacy = Record<string, LegacyLevel>;