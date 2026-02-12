import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './DeliverableViewer.module.css';

const DeliverableViewer: React.FC = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    if (state.currentDeliverable) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [state.currentDeliverable]);

  if (!state.currentDeliverable) return null;

  const handleClose = () => {
    dispatch({ type: 'SET_CURRENT_DELIVERABLE', payload: null });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(state.currentDeliverable!.content);
    alert('DELIVERABLE COPIED TO CLIPBOARD');
  };

  const handleDownload = () => {
    const blob = new Blob([state.currentDeliverable!.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deliverable-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting for display
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className={styles.heading1}>
              {line.substring(2)}
            </h1>
          );
        } else if (line.startsWith('## ')) {
          return (
            <h2 key={index} className={styles.heading2}>
              {line.substring(3)}
            </h2>
          );
        } else if (line.startsWith('### ')) {
          return (
            <h3 key={index} className={styles.heading3}>
              {line.substring(4)}
            </h3>
          );
        } else if (line.startsWith('#### ')) {
          return (
            <h4 key={index} className={styles.heading4}>
              {line.substring(5)}
            </h4>
          );
        } else if (line.startsWith('- ')) {
          return (
            <li key={index} className={styles.listItem}>
              {line.substring(2)}
            </li>
          );
        } else if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={index} className={styles.bold}>
              {line.substring(2, line.length - 2)}
            </p>
          );
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return (
            <p key={index} className={styles.paragraph}>
              {line}
            </p>
          );
        }
      });
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>[DELIVERABLE_OUTPUT]</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            [X]
          </button>
        </div>

        <div className={styles.content}>{formatContent(state.currentDeliverable.content)}</div>

        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handleCopy}>
            [COPY]
          </button>
          <button className={styles.actionButton} onClick={handleDownload}>
            [DOWNLOAD]
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliverableViewer;
