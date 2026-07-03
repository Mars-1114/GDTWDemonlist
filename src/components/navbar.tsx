interface NavbarProps {
    setView: (view: string) => void;
}

export function Navbar({ setView }: NavbarProps) {
    return (
        <nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#eee' }}>
            <button onClick={() => setView('classic_level')}>Classic</button>
            <button onClick={() => setView('about')}>About</button>
            <button onClick={() => setView('projects')}>Projects</button>
        </nav>
    );
}