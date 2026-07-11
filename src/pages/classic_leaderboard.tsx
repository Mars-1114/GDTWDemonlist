import { useState, useEffect } from "react";
import { formatLeaderboard } from "../utilities/format_leaderboard";
import * as obj from "../utilities/obj";

export function ClassicLeaderboard() {
    const [leaderboard, setLeaderboard] = useState<obj.Leaderboard | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [rank, setRank] = useState<number>(0);

    // trigger on page load
    useEffect(() => {
        // fetch data
        async function loadData() {
            try {
                let data = await formatLeaderboard("classic");
                setLeaderboard(data);
            }
            catch (error) {
                console.log("Failed to load data:", error);
            }
            finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return <div>Loading Leaderboard...</div>;
    }

    console.log(leaderboard);

    return (
        <div>
            Hello!
        </div>
    );
}