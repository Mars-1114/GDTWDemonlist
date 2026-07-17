import { useState } from "react";
import { Demonlist } from "../components/demonlist.tsx";
import { DemonlistDetail } from "../components/demonlist_detail.tsx";
import * as obj from "../utilities/obj";

export function ClassicLevel( {data}: {data: obj.Data} ) {
    const [lvl_id, setLvlId] = useState<string>(data.demonlist.classic.keys().next().value!);

    return (
        <div style={{display: "flex", flexDirection: "row", height: "500px"}}>
            <div style={{flex: 1, overflowY: "scroll"}}>
                <Demonlist levels={data.demonlist.classic} setLvlId={setLvlId} />
            </div>
            <div style={{flex: 1}}>
                <DemonlistDetail lvl_id={lvl_id} level={data.demonlist.classic.get(lvl_id)!}/>
            </div>
        </div>
    );
}