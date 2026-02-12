import React from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import FileUpload from './components/FileUpload/FileUpload';
import PromptInput from './components/PromptInput/PromptInput';
import OutputTypeSelector from './components/OutputTypeSelector/OutputTypeSelector';
import GenerateButton from './components/GenerateButton/GenerateButton';
import ProjectArchive from './components/ProjectArchive/ProjectArchive';
import DeliverableViewer from './components/DeliverableViewer/DeliverableViewer';
import styles from './App.module.css';

function App() {
  return (
    <AppProvider>
      <div className={styles.app}>
        <div className={styles.container}>
          <Header />

          <div className={styles.mainContent}>
            {/* Left Column - Input Form */}
            <div className={styles.leftColumn}>
              <FileUpload />
              <PromptInput />
              <OutputTypeSelector />
              <GenerateButton />
            </div>

            {/* Right Column - Project Archive */}
            <div className={styles.rightColumn}>
              <ProjectArchive />
            </div>
          </div>

          <Footer />
        </div>

        {/* Deliverable Viewer Modal */}
        <DeliverableViewer />
      </div>
    </AppProvider>
  );
}

export default App;
