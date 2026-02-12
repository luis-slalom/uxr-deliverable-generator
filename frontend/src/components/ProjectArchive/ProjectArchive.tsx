import React from 'react';
import { useApp } from '../../context/AppContext';
import styles from './ProjectArchive.module.css';

const ProjectArchive: React.FC = () => {
  const { state, viewDeliverable, deleteProject } = useApp();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getDeliverableLabel = (type: string) => {
    switch (type) {
      case 'persona':
        return 'USER_PERSONA';
      case 'journey':
        return 'JOURNEY_MAP';
      case 'blueprint':
        return 'SERVICE_BLUEPRINT';
      default:
        return type.toUpperCase();
    }
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (window.confirm('DELETE PROJECT? THIS CANNOT BE UNDONE.')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <div className={styles.archive}>
      <div className={styles.archiveHeader}>
        <h2 className={styles.archiveTitle}>[PROJECT_ARCHIVE]</h2>
        <p className={styles.archiveCount}>
          TOTAL_RECORDS: {String(state.projects.length).padStart(3, '0')}
        </p>
      </div>

      <div className={styles.archiveContent}>
        {state.projects.length === 0 ? (
          <div className={styles.archiveEmpty}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 64 64">
                <path
                  d="M10.667 42.667V16L26.667 10.667L42.667 16V42.667"
                  stroke="currentColor"
                  strokeWidth="5.33"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="48"
                  cy="16"
                  r="5.333"
                  stroke="currentColor"
                  strokeWidth="5.33"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="32"
                  y1="29.333"
                  x2="34.667"
                  y2="29.333"
                  stroke="currentColor"
                  strokeWidth="5.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="32"
                  y1="37.333"
                  x2="42.667"
                  y2="37.333"
                  stroke="currentColor"
                  strokeWidth="5.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="32"
                  y1="45.333"
                  x2="42.667"
                  y2="45.333"
                  stroke="currentColor"
                  strokeWidth="5.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className={styles.emptyText}>&gt; NO_PROJECTS_FOUND</p>
            <p className={styles.emptyStatus}>AWAITING_INPUT...</p>
          </div>
        ) : (
          <div className={styles.projectList}>
            {state.projects.map((project) => (
              <div
                key={project.id}
                className={styles.projectItem}
                onClick={() => viewDeliverable(project.id)}
              >
                <div className={styles.projectInfo}>
                  <div className={styles.projectName}>{project.name}</div>
                  <div className={styles.projectMeta}>
                    <span className={styles.projectType}>
                      {getDeliverableLabel(project.deliverable_type)}
                    </span>
                    <span className={styles.projectDate}>
                      {formatDate(project.created_at)}
                    </span>
                  </div>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDelete(e, project.id)}
                  aria-label="Delete project"
                >
                  [DEL]
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectArchive;
