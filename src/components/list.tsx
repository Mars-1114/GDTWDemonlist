import * as obj from "../utilities/obj"

type setRank = (rank: number) => void;

function ListUnit({ name, position, setRank }: { name: string; position: number, setRank: setRank }) {
    return (
        <div onClick={() => setRank(position - 1)}>
            #{position} - {name}
        </div>
    );
}

export function List({ levels, setRank }: { levels: obj.OrderedLevels, setRank: setRank }) {
    let rows = [];
    for (let lvl_id in levels) {
        let level = levels[lvl_id];
        rows.push(
            <ListUnit key={lvl_id} name={level.name} position={level.local_position} setRank={setRank} />
        );
    }
    return (
        <>
            {rows}
        </>
    );
}