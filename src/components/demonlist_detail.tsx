import type { JSX } from "react/jsx-runtime";
import * as obj from "../utilities/obj";

function DemonlistDetailUnit({ player, record, rank }: { player: string, record: obj.RawRecord, rank:  number }) {
    return (
        <div>
            #{ rank } - { player } <a href={record.url}>vid</a> ({ record.date })
        </div>
    );
}

export function DemonlistDetail({ lvl_id, level }: { lvl_id: string, level: obj.FormattedLevel}) {
    let rows: JSX.Element[] = [];
    let rank = 0;
    level.records.forEach((record, player) => {
        ++rank;
        rows.push(
            <DemonlistDetailUnit key={player} record={record} player={player} rank={rank}/>
        )
    })
    return (
        <>
            <div>
                <h2>{level.name}</h2>
                <h4>by {level.publisher_id}</h4>
                <div>
                    #{level.local_rank} [ #{level.aredl_rank} ] / {lvl_id} / {level.points}
                </div>
            </div>
            { rows }
        </>
    );
}