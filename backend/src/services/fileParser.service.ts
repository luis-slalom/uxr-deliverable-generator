import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import * as XLSX from 'xlsx';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

export class FileParserService {
  /**
   * Parse a file and extract its text content
   * @param filePath Absolute path to the file
   * @returns Extracted text content
   */
  static async parseFile(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    try {
      switch (ext) {
        case '.pdf':
          return await this.parsePDF(filePath);
        case '.docx':
        case '.doc':
          return await this.parseWord(filePath);
        case '.csv':
        case '.xlsx':
        case '.xls':
          return await this.parseSpreadsheet(filePath);
        case '.txt':
        case '.md':
          return await this.parseText(filePath);
        default:
          throw new Error(`Unsupported file type: ${ext}`);
      }
    } catch (error) {
      console.error(`Error parsing file ${filePath}:`, error);
      throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse PDF file
   */
  private static async parsePDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  /**
   * Parse Word document
   */
  private static async parseWord(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  /**
   * Parse spreadsheet (CSV, Excel)
   */
  private static async parseSpreadsheet(filePath: string): Promise<string> {
    const workbook = XLSX.readFile(filePath);
    let text = '';

    // Process all sheets
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) {
        return;
      }
      text += `\n=== ${sheetName} ===\n`;
      text += XLSX.utils.sheet_to_csv(sheet);
      text += '\n';
    });

    return text.trim();
  }

  /**
   * Parse text file
   */
  private static async parseText(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Get file preview (first N characters)
   */
  static getPreview(content: string, maxLength: number = 500): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }

  /**
   * Get file stats
   */
  static getFileStats(filePath: string) {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      sizeFormatted: this.formatFileSize(stats.size),
      modified: stats.mtime,
    };
  }

  /**
   * Format file size in human-readable format
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
