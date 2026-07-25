interface SearchBarProps {
    setText: (text: string) => void;
}

export function SearchBar({setText}: SearchBarProps) {
    return <input type="text" onChange={(event) => setText(event.target.value)} maxLength={20} placeholder="搜尋關卡" />;
}