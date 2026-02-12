import React from 'react';
import { useApp } from '../../context/AppContext';
import styles from './GenerateButton.module.css';

const GenerateButton: React.FC = () => {
  const { state, generateDeliverable } = useApp();

  const isDisabled = state.files.length === 0 || state.isGenerating;

  const handleGenerate = async () => {
    if (isDisabled) return;

    try {
      await generateDeliverable();
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <button
      className={`${styles.generateButton} ${isDisabled ? styles.disabled : ''}`}
      onClick={handleGenerate}
      disabled={isDisabled}
      type="button"
    >
      {state.isGenerating ? (
        <>
          <span className={styles.spinner}></span>
          &gt;&gt; GENERATING...
        </>
      ) : (
        '>> GENERATE_OUTPUT'
      )}
    </button>
  );
};

export default GenerateButton;
