import db from '../config/database.config.js';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
  id: string;
  name: string;
  deliverable_type: string;
  created_at: string;
  updated_at: string;
}

export interface Deliverable {
  id: string;
  project_id: string;
  content: string;
  context_used: string | null;
  file_names: string | null;
  created_at: string;
}

export class DatabaseService {
  // Project CRUD operations
  static createProject(name: string, deliverableType: string): Project {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO projects (id, name, deliverable_type)
      VALUES (?, ?, ?)
    `);

    stmt.run(id, name, deliverableType);

    return this.getProjectById(id)!;
  }

  static getAllProjects(): Project[] {
    const stmt = db.prepare(`
      SELECT * FROM projects
      ORDER BY created_at DESC
    `);

    return stmt.all() as Project[];
  }

  static getProjectById(id: string): Project | null {
    const stmt = db.prepare(`
      SELECT * FROM projects WHERE id = ?
    `);

    return stmt.get(id) as Project | null;
  }

  static updateProject(id: string, name: string): Project | null {
    const stmt = db.prepare(`
      UPDATE projects
      SET name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(name, id);

    return this.getProjectById(id);
  }

  static deleteProject(id: string): boolean {
    const stmt = db.prepare(`
      DELETE FROM projects WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Deliverable CRUD operations
  static createDeliverable(
    projectId: string,
    content: string,
    contextUsed?: string,
    fileNames?: string[]
  ): Deliverable {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO deliverables (id, project_id, content, context_used, file_names)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      projectId,
      content,
      contextUsed || null,
      fileNames ? JSON.stringify(fileNames) : null
    );

    return this.getDeliverableById(id)!;
  }

  static getDeliverableById(id: string): Deliverable | null {
    const stmt = db.prepare(`
      SELECT * FROM deliverables WHERE id = ?
    `);

    return stmt.get(id) as Deliverable | null;
  }

  static getDeliverablesByProjectId(projectId: string): Deliverable[] {
    const stmt = db.prepare(`
      SELECT * FROM deliverables
      WHERE project_id = ?
      ORDER BY created_at DESC
    `);

    return stmt.all(projectId) as Deliverable[];
  }

  static deleteDeliverable(id: string): boolean {
    const stmt = db.prepare(`
      DELETE FROM deliverables WHERE id = ?
    `);

    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Statistics
  static getProjectCount(): number {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM projects
    `);

    const result = stmt.get() as { count: number };
    return result.count;
  }
}
