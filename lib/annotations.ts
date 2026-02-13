// Annotation types
export interface Annotation {
    id: string;
    pageNumber: number;
    rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    color: string;
    selectedText: string;
    note?: string;
    createdAt: string;
}

const STORAGE_PREFIX = 'pdf_annotations_';

// Get annotations for a specific PDF
export function getAnnotations(pdfKey: string): Annotation[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_PREFIX + pdfKey);
    if (!stored) return [];

    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save annotations for a specific PDF
export function saveAnnotations(pdfKey: string, annotations: Annotation[]): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(STORAGE_PREFIX + pdfKey, JSON.stringify(annotations));
}

// Add a new annotation
export function addAnnotation(pdfKey: string, annotation: Omit<Annotation, 'id' | 'createdAt'>): Annotation {
    const annotations = getAnnotations(pdfKey);
    const newAnnotation: Annotation = {
        ...annotation,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };

    annotations.push(newAnnotation);
    saveAnnotations(pdfKey, annotations);

    return newAnnotation;
}

// Update an existing annotation
export function updateAnnotation(pdfKey: string, id: string, updates: Partial<Annotation>): void {
    const annotations = getAnnotations(pdfKey);
    const index = annotations.findIndex(a => a.id === id);

    if (index !== -1) {
        annotations[index] = { ...annotations[index], ...updates };
        saveAnnotations(pdfKey, annotations);
    }
}

// Delete an annotation
export function deleteAnnotation(pdfKey: string, id: string): void {
    const annotations = getAnnotations(pdfKey);
    const filtered = annotations.filter(a => a.id !== id);
    saveAnnotations(pdfKey, filtered);
}

// Highlight colors
export const HIGHLIGHT_COLORS = {
    yellow: 'rgba(255, 235, 59, 0.4)',
    green: 'rgba(76, 175, 80, 0.4)',
    blue: 'rgba(33, 150, 243, 0.4)',
    pink: 'rgba(233, 30, 99, 0.4)',
} as const;

export type HighlightColor = keyof typeof HIGHLIGHT_COLORS;
