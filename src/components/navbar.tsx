import type { JSX } from "react/jsx-runtime";

type setView = (view: string) => void;

function Dropdown({ name, links, titles, setView }: { name: string, setView: setView, links: string[], titles: string[] }) {
    let dropdowns: JSX.Element[] = [];
    for (let i = 0; i < links.length; i++) {
        dropdowns.push(
            <div key={links[i]} onClick={() => setView(links[i])}>{titles[i]}</div>
        );
    }
    return (
        <>
            <div>
                {name}
            </div>
            <div style={{background: "white", color: "black"}}>
                {dropdowns}
            </div>
        </>
    );
}

export function Navbar({ setView }: { setView: setView }) {
    return (
        <nav style={{ display: 'flex', gap: '20px', padding: '10px', background: '#eee' }}>
            <Dropdown
                name="Classic"
                links={["classic_demonlist", "classic_leaderboard"]}
                titles={["Demonlist", "Leaderboard"]}
                setView={setView} />
            <Dropdown
                name="Platformer"
                links={["platformer_demonlist", "platformer_leaderboard"]}
                titles={["Demonlist", "Leaderboard"]}
                setView={setView} />
            <button onClick={() => setView('about')}>About</button>
            <button onClick={() => setView('guidelines')}>Guidelines</button>
        </nav>
    );
}