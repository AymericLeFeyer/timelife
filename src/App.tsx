import { useState } from 'react';
import { Header } from './components/Header';
import { Timeline } from './components/Timeline';
import { createTimelineItems } from './utils/timelineUtils';
import { AppDataProvider, useAppData } from './context/AppDataContext';

function AppContent() {
  const { profile, loading, error } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const timelineItems = profile ? createTimelineItems(profile) : [];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Chargement...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Erreur lors du chargement des données.
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header
        name={profile.name}
        role={profile.role}
        contacts={profile.contacts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex-1" style={{ marginTop: '120px' }}>
        <Timeline items={timelineItems} searchQuery={searchQuery} />
      </div>
    </div>
  );
}

function App() {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
}

export default App;
