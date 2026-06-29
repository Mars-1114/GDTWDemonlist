import { useState } from 'react';
import { Navbar } from './components/navbar';
import { Home } from './pages/classic_level';
import { About } from './pages/about';

export default function App() {
    // Track the current view in state
    const [currentView, setCurrentView] = useState<string>('home');

    // Determine which component to render
    const renderView = () => {
        switch (currentView) {
            case 'home':
                return <Home />;
            case 'about':
                return <About />;
            default:
                return <Home />;
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