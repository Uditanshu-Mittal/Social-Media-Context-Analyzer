import * as pdfjsLib from 'pdfjs-dist';

// Configure worker safely
try {
  // Using unpkg / cdnjs or internal worker URL
  if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF Worker initialization note:', e);
}

export interface PDFExtractionProgress {
  currentPage: number;
  totalPages: number;
  percent: number;
  message: string;
}

export async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: PDFExtractionProgress) => void
): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      useSystemFonts: true,
    } as any);

    if (onProgress) {
      onProgress({
        currentPage: 0,
        totalPages: 1,
        percent: 10,
        message: 'Parsing PDF document structure...',
      });
    }

    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    let fullText = '';

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      if (onProgress) {
        const percent = Math.round(10 + (pageNum / totalPages) * 80);
        onProgress({
          currentPage: pageNum,
          totalPages,
          percent,
          message: `Extracting text from page ${pageNum} of ${totalPages}...`,
        });
      }

      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ');

      if (pageText.trim()) {
        fullText += (fullText ? '\n\n' : '') + pageText.trim();
      }
    }

    if (onProgress) {
      onProgress({
        currentPage: totalPages,
        totalPages,
        percent: 100,
        message: 'PDF extraction complete.',
      });
    }

    if (!fullText.trim()) {
      throw new Error('No selectable text found in the PDF. It may contain scanned image pages. Consider uploading as JPG/PNG image for OCR.');
    }

    return fullText.trim();
  } catch (error: any) {
    console.error('PDF extraction failed:', error);
    throw new Error(error?.message || 'Failed to read text from PDF.');
  }
}
