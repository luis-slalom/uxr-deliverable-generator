import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerText}>
        <span className={styles.systemTag}>[SYSTEM]</span>
        <span className={styles.divider}>///</span>
      </div>
      <h1 className={styles.mainTitle}>UX RESEARCH GENERATOR</h1>
      <p className={styles.subtitle}>
        &gt; AUTOMATED PERSONA | JOURNEY MAP | SERVICE BLUEPRINT SYNTHESIS
      </p>
      <div className={styles.statusBar}>
        <span>STATUS: ONLINE</span>
        <span>NODE: PRIMARY</span>
      </div>
    </header>
  );
};

export default Header;
