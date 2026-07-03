import { useState } from 'react';
import { Navbar } from './components/navbar';
import { ClassicLevel } from './pages/classic_level';
import { About } from './pages/about';

export default function App() {
    // Track the current view in state
    const [currentView, setCurrentView] = useState<string>('classic_level');

    // Determine which component to render
    const renderView = () => {
        switch (currentView) {
            case 'classic_level':
                return <ClassicLevel />;
            case 'about':
                return <About />;
            default:
                return <ClassicLevel />;
        }
    };

    return (
        <div>
            {/* Pass the state setter down to the Navbar */}
            <Navbar setView={setCurrentView} />

            {/* Render the active page content */}
            <main style={{ padding: '20px' }}>
                {renderView()}
            </main>
        </div>
    );
}