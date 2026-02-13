import { Router, type Request, type Response } from 'express';
import { DatabaseService } from '../services/database.service.js';

const router = Router();

/**
 * GET /api/projects
 * Get all projects
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const projects = DatabaseService.getAllProjects();
    const count = DatabaseService.getProjectCount();

    res.json({
      projects,
      count,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/projects/:id
 * Get a specific project by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    const project = DatabaseService.getProjectById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      error: 'Failed to fetch project',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/projects/:id/deliverables
 * Get all deliverables for a project
 */
router.get('/:id/deliverables', (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    const project = DatabaseService.getProjectById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const deliverables = DatabaseService.getDeliverablesByProjectId(id);

    res.json({
      project,
      deliverables,
    });
  } catch (error) {
    console.error('Error fetching deliverables:', error);
    res.status(500).json({
      error: 'Failed to fetch deliverables',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/projects/:id
 * Update a project name
 */
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = DatabaseService.updateProject(id, name);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      error: 'Failed to update project',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete a project
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    const deleted = DatabaseService.deleteProject(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      error: 'Failed to delete project',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
