import { useState, useEffect } from 'react';
import { Navbar } from './components/navbar';
import { ClassicLevel } from './pages/classic_level';
import { ClassicLeaderboard } from "./pages/classic_leaderboard";
import { About } from './pages/about';
import { Guidelines } from "./pages/guidelines";

import { fetchAll } from "./utilities/fetch";
import { formatDemonlist, formatLeaderboard, formatChangelog } from "./utilities/format";
import * as obj from "./utilities/obj";

export default function App() {
    const [currentView, setCurrentView] = useState<string>('classic_level');
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<obj.Data | null>(null);

    useEffect(() => {
        async function loadData() {
            let rawData = await fetchAll();
            if (rawData == null) {
                setLoading(false);
                return;
            }

            let classicDemonlist = formatDemonlist(
                rawData.levels.classic,
                rawData.records.classic,
                rawData.legacies.classic
            );
            let platformerDemonlist = formatDemonlist(
                rawData.levels.platformer,
                rawData.records.platformer,
                rawData.legacies.platformer
            );
            setData({
                demonlist: {
                    classic: classicDemonlist,
                    platformer: platformerDemonlist
                },
                leaderboard: {
                    classic: formatLeaderboard(classicDemonlist),
                    platformer: formatLeaderboard(platformerDemonlist)
                },
                players: rawData.players,
                changelogs: formatChangelog(rawData.changelog, classicDemonlist, platformerDemonlist),
            });

            setLoading(false);
        }

        loadData();
    }, []);

    if (loading) {
        return <div>Loading Data...</div>;
    }

    if (data == null) {
        return <div>Failed to load data :(</div>
    }

    const renderView = () => {
        switch (currentView) {
            case 'classic_level':
                return <ClassicLevel data={data} />;
            case 'classic_leaderboard':
                return <ClassicLeaderboard data={data} />;
            case 'about':
                return <About changelogs={data.changelogs} />;
            case 'guidelines':
                return <Guidelines />;
            default:
                return <ClassicLevel data={data} />;
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