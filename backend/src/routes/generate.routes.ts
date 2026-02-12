import { Router, type Request, type Response } from 'express';
import { ClaudeService, type DeliverableType } from '../services/claude.service.js';
import { FileParserService } from '../services/fileParser.service.js';
import { DatabaseService } from '../services/database.service.js';
import path from 'path';
import fs from 'fs';

const router = Router();

interface GenerateRequest {
  files: string[]; // File IDs
  context: string;
  deliverableType: DeliverableType;
  projectName?: string;
}

/**
 * POST /api/generate
 * Generate a deliverable from uploaded files
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { files, context, deliverableType, projectName }: GenerateRequest = req.body;

    // Validation
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    if (!deliverableType || !['persona', 'journey', 'blueprint'].includes(deliverableType)) {
      return res.status(400).json({ error: 'Invalid deliverable type' });
    }

    // Check if Claude API key is configured
    if (!ClaudeService.validateApiKey()) {
      return res.status(500).json({
        error: 'Claude API key not configured',
        message: 'Please set ANTHROPIC_API_KEY in your environment variables',
      });
    }

    const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

    // Parse all uploaded files
    let combinedContent = '';
    const fileNames: string[] = [];

    for (const fileId of files) {
      const filePath = path.join(UPLOAD_DIR, fileId);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: `File not found: ${fileId}` });
      }

      try {
        const content = await FileParserService.parseFile(filePath);
        combinedContent += `\n\n--- File: ${fileId} ---\n${content}`;
        fileNames.push(fileId);
      } catch (error) {
        return res.status(400).json({
          error: `Failed to parse file: ${fileId}`,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Generate deliverable using Claude
    const deliverable = await ClaudeService.generateDeliverable(
      deliverableType,
      combinedContent,
      context
    );

    // Create project and save deliverable
    const project = DatabaseService.createProject(
      projectName || `${deliverableType.charAt(0).toUpperCase() + deliverableType.slice(1)} - ${new Date().toLocaleDateString()}`,
      deliverableType
    );

    const savedDeliverable = DatabaseService.createDeliverable(
      project.id,
      deliverable,
      context,
      fileNames
    );

    res.json({
      project,
      deliverable: savedDeliverable,
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      error: 'Failed to generate deliverable',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
