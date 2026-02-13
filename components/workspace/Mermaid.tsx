"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";


interface MermaidProps {
    chart: string;
}

mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'inherit',
    logLevel: 'error',
    flowchart: {
        htmlLabels: true,
        useMaxWidth: true,
    }
});


export function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (chart && ref.current) {
            setError(false);

            // Clean markdown blocks and common AI artifacts
            let cleanChart = chart.trim();
            if (cleanChart.includes('```mermaid')) {
                cleanChart = cleanChart.split('```mermaid')[1].split('```')[0].trim();
            } else if (cleanChart.includes('```')) {
                cleanChart = cleanChart.replace(/```[a-z]*\n/gi, '').replace(/\n```/g, '').trim();
            }

            // Ensure it starts with a valid mermaid keyword if missing
            if (!cleanChart.startsWith('graph ') && !cleanChart.startsWith('flowchart ') && !cleanChart.startsWith('mindmap')) {
                cleanChart = 'graph TD\n' + cleanChart;
            }

            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

            try {
                mermaid.render(id, cleanChart).then(({ svg }) => {
                    setSvg(svg);
                }).catch((err) => {
                    console.error("Mermaid render error:", err);
                    setError(true);
                });
            } catch (err) {
                console.error("Mermaid sync render error:", err);
                setError(true);
            }
        }
    }, [chart]);

    if (error) return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg bg-destructive/10">
            <p className="text-destructive font-semibold">Error al renderizar el diagrama.</p>
            <pre className="text-xs bg-background p-2 rounded border overflow-auto max-h-40">
                {chart}
            </pre>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Reintentar
            </Button>
        </div>
    );

    if (!svg && chart) return (
        <div className="flex flex-col items-center justify-center p-8 gap-4">
            <Loader2 className="animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Generando visualización...</p>
        </div>
    );

    if (!chart) return null;

    return (
        <div
            ref={ref}
            className="mermaid w-full flex justify-center p-4 bg-white rounded-lg border border-primary/20 overflow-auto shadow-sm min-h-[300px]"
            style={{ minWidth: '100%' }}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
