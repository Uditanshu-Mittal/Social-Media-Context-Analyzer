import Tesseract from 'tesseract.js';

export interface OCRExtractionProgress {
  status: string;
  percent: number;
  message: string;
}

export async function extractTextFromImage(
  file: File,
  onProgress?: (progress: OCRExtractionProgress) => void
): Promise<string> {
  try {
    if (onProgress) {
      onProgress({
        status: 'initializing',
        percent: 10,
        message: 'Initializing OCR Engine (Tesseract.js)...',
      });
    }

    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (onProgress) {
          const status = m.status || 'processing';
          let percent = 20;
          let friendlyMsg = 'Processing image...';

          if (status === 'loading tesseract core') {
            percent = 25;
            friendlyMsg = 'Loading OCR Neural Core...';
          } else if (status === 'initializing tesseract') {
            percent = 35;
            friendlyMsg = 'Setting up language dictionary...';
          } else if (status === 'loading language traineddata') {
            percent = 50;
            friendlyMsg = 'Loading trained OCR models...';
          } else if (status === 'recognizing text') {
            const innerProg = Math.round((m.progress || 0) * 100);
            percent = 50 + Math.round(innerProg * 0.45);
            friendlyMsg = `Recognizing text characters (${innerProg}%)...`;
          }

          onProgress({
            status,
            percent: Math.min(98, Math.max(10, percent)),
            message: friendlyMsg,
          });
        }
      },
    });

    if (onProgress) {
      onProgress({
        status: 'done',
        percent: 100,
        message: 'OCR Text recognition complete.',
      });
    }

    const extracted = result.data.text.trim();
    if (!extracted) {
      throw new Error('No legible text was detected in the uploaded image. Please ensure the image has clear contrast and legible font.');
    }

    return extracted;
  } catch (error: any) {
    console.error('Image OCR error:', error);
    throw new Error(error?.message || 'Failed to extract text from image using OCR.');
  }
}
