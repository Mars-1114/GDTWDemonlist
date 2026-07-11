import * as obj from "../utilities/obj";
import type {record} from "../utilities/obj";

function ListDetailUnit({ record, rank }: { record: [string, record], rank:  number }) {
    return (
        <div>
            #{ rank } - { record[0] } <a href={record[1].url}>vid</a> ({ record[1].date })
        </div>
    );
}

export function ListDetail({ level }: { level: obj.Level}) {
    let rows = [];
    let rank = 0;
    for (const record of level.records) {
        ++rank;
        rows.push(
            <ListDetailUnit record={record} rank={rank}/>
        );
    }
    return (
        <>
            <div>
                <h2>{level.name}</h2>
                <h4>by {level.publisher_id}</h4>
                <div>
                    #{level.local_position} [ #{level.position} ] / {level.level_id} / {level.points}
                </div>
            </div>
            { rows }
        </>
    );
}