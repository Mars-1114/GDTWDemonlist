import { useState, useEffect } from 'react';
import { Navbar } from './components/navbar';
import { ClassicLevel } from './pages/classic_level';
import { ClassicLeaderboard } from "./pages/classic_leaderboard";
import { About } from './pages/about';
import { Guidelines } from "./pages/guidelines.tsx";

import { fetchAll } from "./utilities/fetch";
import { formatDemonlist, formatLeaderboard, formatChangelog } from "./utilities/format";
import * as obj from "./utilities/obj";

export default function App() {
    const [currentView, setCurrentView] = useState<string>('classic_level');
    const [loading, setLoading] = useState<boolean>(true);
    const [classicDemonlist, setClassicDemonlist] = useState<obj.Demonlist | null>(null);
    const [classicLeaderboard, setClassicLeaderboard] = useState<obj.Leaderboard | null>(null);
    const [platformerDemonlist, setPlatformerDemonlist] = useState<obj.Demonlist | null>(null);
    const [platformerLeaderboard, setPlatformerLeaderboard] = useState<obj.Leaderboard | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                let classicData = await fetchAll("classic");
                let classicDemonlist = formatDemonlist(classicData);
                let classicLeaderboard = formatLeaderboard(classicDemonlist);
                setClassicDemonlist(classicDemonlist);
                setClassicLeaderboard(classicLeaderboard);

                console.log(formatChangelog(classicDemonlist));
            }
            catch(error) {
                console.log("Failed to fetch classic levels:", error);
            }

            try {
                let platformerData = await fetchAll("platformer");
                let platformerDemonlist = formatDemonlist(platformerData);
                let platformerLeaderboard = formatLeaderboard(platformerDemonlist);
                setPlatformerDemonlist(platformerDemonlist);
                setPlatformerLeaderboard(platformerLeaderboard);
            }
            catch(error) {
                console.log("Failed to fetch platformer levels:", error);
            }

            setLoading(false);
        }

        loadData();
    }, []);

    const renderView = () => {
        switch (currentView) {
            case 'classic_level':
                return <ClassicLevel demonlist={classicDemonlist} loading={loading} />;
            case 'classic_leaderboard':
                return <ClassicLeaderboard leaderboard={classicLeaderboard} demonlist={classicDemonlist!} loading={loading} />;
            case 'about':
                return <About />;
            case 'guidelines':
                return <Guidelines />;
            default:
                return <ClassicLevel demonlist={classicDemonlist} loading={loading} />;
        }
    };

    return (
        <div>
            <Navbar setView={setCurrentView} />

            <main style={{ padding: '20px' }}>
                {renderView()}
            </main>
        </div>
    );
}