import { useState } from 'react';
import { Header } from './components/Header';
import { Timeline } from './components/Timeline';
import { createTimelineItems } from './utils/timelineUtils';
import profileData from './data/profile.json';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const timelineItems = createTimelineItems(profileData);

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header
        name={profileData.name}
        role={profileData.role}
        contacts={profileData.contacts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex-1" style={{ marginTop: '120px' }}>
        <Timeline items={timelineItems} searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default App;
