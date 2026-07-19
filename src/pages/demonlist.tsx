import { useState } from "react";
import { DemonlistList } from "../components/demonlist_list.tsx";
import { DemonlistDetail } from "../components/demonlist_detail.tsx";
import * as obj from "../utilities/obj";

export function DemonlistPage({data, list_type}: {data: obj.Data, list_type: "classic" | "platformer"} ) {
    const demonlist = list_type === "classic" ? data.demonlist.classic : data.demonlist.platformer;
    const [lvl_id, setLvlId] = useState<string>(demonlist.keys().next().value!);

    return (
        <div style={{display: "flex", flexDirection: "row", height: "500px"}}>
            <div style={{flex: 1, overflowY: "scroll"}}>
                <DemonlistList demonlist={demonlist} setLvlId={setLvlId} />
            </div>
            <div style={{flex: 1}}>
                <DemonlistDetail lvl_id={lvl_id} level={demonlist.get(lvl_id)!}/>
            </div>
        </div>
    );
}