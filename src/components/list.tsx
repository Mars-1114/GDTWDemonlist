import * as obj from "../utilities/obj"

function ListUnit({ name, position }: {name: string; position: number}) {
    return (
        <div>
            #{position} - {name}
        </div>
    );
}

export function List({ levels }: {levels: obj.Levels}) {
    let rows = [];
    for (let lvl_id in levels) {
        let level = levels[lvl_id];
        rows.push(
            <ListUnit name={level.name} position={level.local_position} />
        );
    }
    return (
        <>
            {rows}
        </>
    );
}