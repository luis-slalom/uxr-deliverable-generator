import { Router, type Request, type Response } from 'express';
import { upload, handleMulterError } from '../middleware/upload.middleware.js';
import { FileParserService } from '../services/fileParser.service.js';
import path from 'path';

const router = Router();

/**
 * POST /api/upload
 * Upload a file and extract its content
 */
router.post(
  '/',
  upload.single('file'),
  handleMulterError,
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { filename, originalname, mimetype, size, path: filePath } = req.file;

      // Parse file content
      const content = await FileParserService.parseFile(filePath);
      const preview = FileParserService.getPreview(content, 500);
      const stats = FileParserService.getFileStats(filePath);

      res.json({
        id: filename,
        name: originalname,
        type: mimetype,
        size: stats.size,
        sizeFormatted: stats.sizeFormatted,
        preview,
        contentLength: content.length,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        error: 'Failed to process file',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

export default router;
