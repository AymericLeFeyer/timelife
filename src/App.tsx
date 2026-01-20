import { useState } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
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
      />
      <div className="fixed top-[140px] left-0 right-0 bg-white border-b border-gray-200 z-20 py-4 px-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div className="flex-1" style={{ marginTop: '140px' }}>
        <Timeline items={timelineItems} searchQuery={searchQuery} />
      </div>
    </div>
  );
}

export default App;
