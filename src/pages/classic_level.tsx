import { useState, useEffect } from "react";
import { formatLevel } from "../utilities/format_levels";
import { List } from "../components/list.tsx";
import { ListDetail } from "../components/list_detail.tsx"
import * as obj from "../utilities/obj";

export function ClassicLevel() {
    const [levels, setLevels] = useState<obj.OrderedLevels | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [rank, setRank] = useState<number>(0);

    // trigger on page load
    useEffect(() => {
        // fetch data
        async function loadData() {
            try {
                let data = await formatLevel("classic");
                setLevels(data);
            } catch (error) {
                console.error("Failed to fetch levels:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return <div>Loading Demonlist...</div>;
    }

    return (
        <div style={{display: "flex", flexDirection: "row", height: "500px"}}>
            <div style={{flex: 1, overflowY: "scroll"}}>
                {levels ? <List levels={levels} setRank={setRank} /> : <div>No levels found.</div>}
            </div>
            <div style={{flex: 1}}>
                <ListDetail level_detail={levels[rank].records} />
            </div>
        </div>
    );
}