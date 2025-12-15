import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extract text from a PDF buffer
 */
export async function parsePdf(buffer) {
    const data = await pdfParse(buffer);
    return data.text;
}

/**
 * Extract text from a DOCX buffer
 */
export async function parseDocx(buffer) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

/**
 * Parse file based on its extension
 */
export async function parseFile(buffer, filename) {
    const extension = filename.split('.').pop().toLowerCase();

    switch (extension) {
        case 'pdf':
            return parsePdf(buffer);
        case 'docx':
        case 'doc':
            return parseDocx(buffer);
        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
}
