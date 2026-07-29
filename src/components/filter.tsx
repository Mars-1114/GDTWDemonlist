interface SearchBarProps {
    setText: (text: string) => void;
}

interface CycleButtonProps {
    states: {id: string, label: string}[];
    state: {id: string, label: string};
    setState: (state: {id: string, label: string}) => void;
}

export function SearchBar({setText}: SearchBarProps) {
    return <input type="text" onChange={(event) => setText(event.target.value)} maxLength={20} placeholder="搜尋關卡" />;
}

export function CycleButton({states, state, setState}: CycleButtonProps) {
    let nextStateIdx = (states.findIndex(x => x.id == state.id) + 1) % states.length;
    let nextState = states[nextStateIdx];
    return (
        <button onClick={() => setState(nextState)}>
            {state.label}
        </button>
    );
}