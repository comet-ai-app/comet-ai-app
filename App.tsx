



import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ProjectsPage from './components/ProjectsPage';
import SettingsPage from './components/SettingsPage';
// FIX: Import specific project types to create a more explicit union type
// that helps TypeScript with type narrowing in the `addProject` function.
import { Page, Theme, Project, Voice, AudioProject, DubbingProject, TranscriptProject } from './types';
import { PREBUILT_VOICES } from './constants';

// FIX: Define an explicit union type for new projects. This helps the TypeScript
// compiler correctly narrow the type within the switch statement in `addProject`,
// resolving property access errors that occurred with the more abstract
// `Omit<Project, 'id' | 'createdAt'>` type.
type NewProjectPayload =
    | Omit<AudioProject, 'id' | 'createdAt'>
    | Omit<TranscriptProject, 'id' | 'createdAt'>
    | Omit<DubbingProject, 'id' | 'createdAt'>;

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [projects, setProjects] = useState<Project[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('comet-theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
       // Default to user's system preference
       const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
       setTheme(prefersDark ? 'dark' : 'light');
    }

    const storedProjects = localStorage.getItem('comet-projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }

    const storedVoices = localStorage.getItem('comet-voices');
    if (storedVoices) {
      setVoices(JSON.parse(storedVoices));
    } else {
        // Initialize with default voices
        const defaultVoices = PREBUILT_VOICES.slice(0, 2).map((voice, index) => ({
            id: `default-${index + 1}`,
            name: `Cloned Voice ${index + 1}`,
            apiVoice: voice
        }));
        setVoices(defaultVoices);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('comet-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('comet-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('comet-voices', JSON.stringify(voices));
  }, [voices]);


  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const addProject = useCallback((project: NewProjectPayload) => {
      let newProject: Project;
      const commonDetails = {
          id: `proj-${Date.now()}`,
          createdAt: new Date().toISOString()
      };

      switch (project.type) {
        case 'Live Transcript':
            // FIX: Explicitly construct the new project object. Spreading a discriminated
            // union was causing TypeScript to lose type information.
            newProject = {
              ...commonDetails,
              name: project.name,
              type: project.type,
              transcript: project.transcript,
            };
            break;
        case 'Dubbing':
            // FIX: Explicitly construct the new project object. Spreading a discriminated
            // union was causing TypeScript to lose type information.
            newProject = {
              ...commonDetails,
              name: project.name,
              type: project.type,
              fileName: project.fileName,
              dubbedAudioBase64: project.dubbedAudioBase64,
              sourceTranscript: project.sourceTranscript,
              translatedTranscript: project.translatedTranscript,
            };
            break;
        case 'TTS':
        case 'STS':
            // FIX: Explicitly construct the new project object. Spreading a discriminated
            // union was causing TypeScript to lose type information.
            newProject = {
              ...commonDetails,
              name: project.name,
              type: project.type,
              audioBase64: project.audioBase64,
            };
            break;
        default:
            // This should not happen with TypeScript checking, but it's good practice
            console.error("Unknown project type:", project);
            return;
      }
      setProjects(prev => [newProject, ...prev]);
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard voices={voices} addProject={addProject} />;
      case 'projects':
        return <ProjectsPage projects={projects} deleteProject={deleteProject} />;
      case 'settings':
        return <SettingsPage voices={voices} setVoices={setVoices} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={() => setCurrentPage('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 bg-comet-light dark:bg-comet-dark">
      {currentPage !== 'landing' && (
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} theme={theme} toggleTheme={toggleTheme} />
      )}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;