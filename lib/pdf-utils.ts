export async function extractTextFromPDF(url: string): Promise<string> {
    try {
        // Dynamically import pdfjs-dist to avoid SSR/Build issues with canvas/DOMMatrix
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

        // Set worker to local file
        if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
            pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        }

        const loadingTask = pdfjs.getDocument(url);
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        }

        return fullText;
    } catch (error) {
        console.error("Error extracting PDF text:", error);
        return "";
    }
}
