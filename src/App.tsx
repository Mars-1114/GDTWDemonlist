import { useState, useEffect } from 'react';
import { Navbar } from './components/navbar';
import { DemonlistPage } from './pages/demonlist.tsx';
import { LeaderboardPage } from "./pages/leaderboard.tsx";
import { About } from './pages/about';
import { Guidelines } from "./pages/guidelines";

import { fetchAll, usePreloadImages } from "./utilities/fetch";
import { formatDemonlist, formatLeaderboard, formatChangelog } from "./utilities/format";
import * as obj from "./utilities/obj";

export default function App() {
    const [currentView, setCurrentView] = useState<string>('classic_level');
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<obj.Data | null>(null);

    // call on page load
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

            usePreloadImages();

            setLoading(false);
        }

        loadData();
    }, []);

    const renderView = () => {
        if (loading) {
            return <div>Loading Data...</div>;
        }
        if (data == null) {
            return <div>Failed to load data :(</div>;
        }

        switch (currentView) {
            case 'classic_demonlist':
                return <DemonlistPage key="classic" data={data} listType="classic" />;
            case 'classic_leaderboard':
                return <LeaderboardPage key="classic" data={data} listType="classic" />;
            case 'platformer_demonlist':
                return <DemonlistPage key="platformer" data={data} listType="platformer" />;
            case 'platformer_leaderboard':
                return <LeaderboardPage key="platformer" data={data} listType="platformer" />;
            case 'about':
                return <About data={data} />;
            case 'guidelines':
                return <Guidelines />;
            default:
                return <DemonlistPage key="classic" data={data} listType="classic" />;
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