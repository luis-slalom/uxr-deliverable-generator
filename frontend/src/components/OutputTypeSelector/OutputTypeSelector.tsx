import React from 'react';
import { useApp } from '../../context/AppContext';
import type { DeliverableType } from '../../types/index.js';
import styles from './OutputTypeSelector.module.css';

const options = [
  { value: 'persona' as DeliverableType, label: '[A] USER_PERSONA' },
  { value: 'journey' as DeliverableType, label: '[B] JOURNEY_MAP' },
  { value: 'blueprint' as DeliverableType, label: '[C] SERVICE_BLUEPRINT' },
];

const OutputTypeSelector: React.FC = () => {
  const { state, setDeliverableType } = useApp();

  const isComplete = !!state.deliverableType;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        [03] OUTPUT_TYPE {isComplete && <span className={styles.checkmark}>[✓]</span>}
      </h2>
      <div className={styles.radioGroup}>
        {options.map((option) => (
          <div
            key={option.value}
            className={`${styles.radioOption} ${
              state.deliverableType === option.value ? styles.selected : ''
            }`}
            onClick={() => setDeliverableType(option.value)}
          >
            <div className={styles.radioButton} />
            <div className={styles.radioLabel}>{option.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OutputTypeSelector;
