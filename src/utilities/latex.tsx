import React, { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathProps {
    formula: string;
    inline?: boolean;
}

export const Latex: React.FC<MathProps> = ({ formula, inline = false }) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            katex.render(formula, containerRef.current, {
                displayMode: !inline,
                throwOnError: false,
            });
        }
    }, [formula, inline]);

    return <span ref={containerRef} />;
};