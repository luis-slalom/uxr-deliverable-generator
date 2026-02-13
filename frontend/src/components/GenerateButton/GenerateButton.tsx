import React from 'react';
import { useApp } from '../../context/AppContext';
import styles from './GenerateButton.module.css';

const GenerateButton: React.FC = () => {
  const { state, generateDeliverable } = useApp();

  // Validation: Check if all required fields are filled
  const hasFiles = state.files.length > 0;
  const hasContext = state.context.trim().length > 0;
  const hasDeliverableType = !!state.deliverableType;

  const isDisabled = !hasFiles || !hasContext || !hasDeliverableType || state.isGenerating;

  // Generate helpful message about what's missing
  const getButtonText = () => {
    if (state.isGenerating) {
      return (
        <>
          <span className={styles.spinner}></span>
          &gt;&gt; GENERATING...
        </>
      );
    }

    if (!hasFiles) {
      return '>> UPLOAD FILE FIRST';
    }

    if (!hasContext) {
      return '>> ENTER PROMPT FIRST';
    }

    if (!hasDeliverableType) {
      return '>> SELECT OUTPUT TYPE';
    }

    return '>> GENERATE_OUTPUT';
  };

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
      title={
        isDisabled && !state.isGenerating
          ? 'Complete all steps: Upload file, enter prompt, select output type'
          : 'Generate your deliverable'
      }
    >
      {getButtonText()}
    </button>
  );
};

export default GenerateButton;
