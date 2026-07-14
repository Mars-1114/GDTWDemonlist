import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";

function LeaderboardDetailUnit({lvl_detail, record, rank}: {lvl_detail: obj.FormattedLevel, record: obj.RawRecord, rank: number}) {
    return (
      <div>
          #{rank} - {lvl_detail.name} <a href={record.url}>link</a> ({record.date}) [{lvl_detail.points}pts]
      </div>
    );
}

export function LeaderboardDetail({player, playerDetail, demonlist}: {player: string, playerDetail: obj.FormattedPlayer, demonlist: obj.Demonlist}) {
    let rows: JSX.Element[] = [];
    playerDetail.records.forEach((record, lvl_id) => {
        rows.push(
          <LeaderboardDetailUnit key={lvl_id} lvl_detail={demonlist.get(lvl_id)!} record={record} rank={demonlist.get(lvl_id)!.local_rank}/>
        );
    })
    return (
      <div>
          <h2>{player}</h2>
          <h4>#{playerDetail.rank} / {playerDetail.points} pts</h4>
          {rows}
      </div>
    );
}