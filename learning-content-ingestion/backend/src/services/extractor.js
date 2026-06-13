const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const buffer = fs.readFileSync(file.path);

  if (ext === '.pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (ext === '.txt' || ext === '.md' || ext === '.csv' || ext === '.json' || ext === '.srt' || ext === '.vtt') {
    return buffer.toString('utf-8');
  }

  throw new Error('Unsupported file type. Please upload PDF, DOCX, TXT, MD, CSV, JSON, SRT, or VTT transcript files.');
}

module.exports = { extractTextFromFile };
