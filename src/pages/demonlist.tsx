import { useState } from "react";

import { DemonlistList } from "../components/demonlist_list.tsx";
import { DemonlistDetail } from "../components/demonlist_detail.tsx";
import { SearchBar } from "../components/filter.tsx";
import * as obj from "../utilities/obj";

interface DemonlistProps {
    data: obj.Data;
    listType: "classic" | "platformer";
}

export function DemonlistPage({data, listType}: DemonlistProps ) {
    const demonlist = listType === "classic" ? data.demonlist.classic : data.demonlist.platformer;
    const [lvlId, setLvlId] = useState<string>(demonlist.keys().next().value!);
    const [filterText, setFilterText] = useState<string>("");
    const [filteredDemonlist, setFilteredDemonlist] = useState(demonlist);

    return (
        <div style={{display: "flex", flexDirection: "row", height: "500px"}}>
            <div style={{flex: 1, overflowY: "scroll"}}>
                <SearchBar setText={setFilterText} />
                <DemonlistList
                    rawDemonlist={demonlist}
                    refDemonlist={filteredDemonlist}
                    viewLvlId={lvlId}
                    setDemonlist={setFilteredDemonlist}
                    setLvlId={setLvlId}
                    filterText={filterText}
                />
            </div>
            <div style={{flex: 1}}>
                <DemonlistDetail lvlId={lvlId} level={filteredDemonlist.get(lvlId)!}/>
            </div>
        </div>
    );
}