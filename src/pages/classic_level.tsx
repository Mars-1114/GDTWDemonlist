import { useState, useEffect } from "react";
import { Demonlist } from "../components/demonlist.tsx";
import { DemonlistDetail } from "../components/demonlist_detail.tsx";
import * as obj from "../utilities/obj";

export function ClassicLevel( {demonlist, loading}: {demonlist: obj.Demonlist | null, loading: boolean} ) {
    const [lvl_id, setLvlId] = useState<string>(demonlist != null ? demonlist.keys().next().value! : "");

    useEffect(() => {
        if (demonlist == null) return;
        setLvlId(demonlist.keys().next().value!);
    }, [demonlist]);

    if (loading) {
        return <div>Loading Demonlist...</div>;
    }
    if (demonlist == null) {
        return (
            <div>No levels found :(</div>
        );
    }

    return (
        <div style={{display: "flex", flexDirection: "row", height: "500px"}}>
            <div style={{flex: 1, overflowY: "scroll"}}>
                <Demonlist levels={demonlist} setLvlId={setLvlId} />
            </div>
            <div style={{flex: 1}}>
                <DemonlistDetail lvl_id={lvl_id} level={demonlist.get(lvl_id)!}/>
            </div>
        </div>
    );
}