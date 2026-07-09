import * as obj from "../utilities/obj";

function ListDetailUnit({ player, rank, record }: { player: string, rank:  number, record: obj.record }) {
    return (
        <div>
            #{ rank } - { player } <a href={record.url}>vid</a>
        </div>
    );
}

export function ListDetail({ level_detail }: { level_detail: obj.OrderedRecord}) {
    let rows = [];
    let rank = 0;
    for (const record of level_detail) {
        ++rank;
        rows.push(
            <ListDetailUnit player={record.player} rank={rank} record={record} />
        );
    }
    return (
        <>
            { rows }
        </>
    );
}