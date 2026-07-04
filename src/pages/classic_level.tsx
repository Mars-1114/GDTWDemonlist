import { useState } from "react";

export function ClassicLevel() {
    const [atPosition, setAtPosition] = useState<number>(0);

    return (
        <div>
            <h1>Welcome to My Site</h1>
            <p>This is the home page rewritten in React!</p>
        </div>
    );
}