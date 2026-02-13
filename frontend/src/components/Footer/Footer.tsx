import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>
        &gt; Created by Luis Hermosilla, a Lead Experience Designer from Slalom // {currentDate} // VER_1.0.0
      </p>
    </footer>
  );
};

export default Footer;
