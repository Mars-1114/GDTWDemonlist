//import { useState } from "react";
import { formatLevel } from "../utilities/format_levels"
import { List } from "../components/list.tsx"

export async function ClassicLevel() {
    //const [atPosition, setAtPosition] = useState<number>(0);
    let levels = await formatLevel("classic");
    return (
        <>
            <List levels={levels} />
        </>
    );
}