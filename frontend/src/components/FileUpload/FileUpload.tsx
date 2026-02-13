import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useApp } from '../../context/AppContext';
import styles from './FileUpload.module.css';

const FileUpload: React.FC = () => {
  const { state, uploadFile, removeFile } = useApp();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    console.log('📁 Files dropped:', acceptedFiles.length);
    setUploadError(null); // Clear previous errors

    for (const file of acceptedFiles) {
      try {
        console.log('⬆️ Uploading:', file.name, file.type, file.size);
        const result = await uploadFile(file);
        console.log('✅ Upload successful:', result);
      } catch (error) {
        console.error('❌ Upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setUploadError(`Failed to upload ${file.name}: ${errorMessage}`);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    multiple: true,
  });

  const isComplete = state.files.length > 0;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        [01] FILE_UPLOAD {isComplete && <span className={styles.checkmark}>[✓]</span>}
      </h2>

      {uploadError && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>[!]</span> {uploadError}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`${styles.uploadArea} ${isDragActive ? styles.dragActive : ''}`}
      >
        <input {...getInputProps()} />
        <div className={styles.uploadIcon}>
          <svg viewBox="0 0 48 48">
            <path
              d="M6 37V17L18 13L30 17V37"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 13V7L30 13"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="24"
              y1="13"
              x2="24"
              y2="37"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className={styles.uploadText}>
          {isDragActive
            ? '> DROP FILES HERE...'
            : '> DRAG FILE OR CLICK TO UPLOAD'}
        </p>
        <button className={styles.uploadButton} type="button">
          SELECT_FILE
        </button>
      </div>

      {state.files.length > 0 && (
        <div className={styles.fileList}>
          <p className={styles.fileListTitle}>&gt; UPLOADED FILES:</p>
          {state.files.map((file) => (
            <div key={file.id} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>
                  {file.sizeFormatted || `${Math.round(file.size / 1024)}KB`}
                </span>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => removeFile(file.id)}
                type="button"
                aria-label="Remove file"
              >
                [X]
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FileUpload;
