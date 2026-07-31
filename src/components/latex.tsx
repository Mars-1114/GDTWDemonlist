import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexProps {
    formula: string;
    inline?: boolean;
}

export function Latex({ formula, inline }: LatexProps) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            katex.render(formula, containerRef.current, {
                displayMode: !inline,
                throwOnError: false,
                strict: false
            });
        }
    }, [formula, inline]);

    return <span ref={containerRef} />;
}