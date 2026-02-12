import React from 'react';
import { useApp } from '../../context/AppContext';
import styles from './PromptInput.module.css';

const PromptInput: React.FC = () => {
  const { state, setContext } = useApp();

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>[02] PROMPT_INPUT</h2>
      <textarea
        className={styles.textArea}
        placeholder="> ENTER ANALYSIS PARAMETERS..."
        value={state.context}
        onChange={(e) => setContext(e.target.value)}
        rows={6}
      />
    </section>
  );
};

export default PromptInput;
