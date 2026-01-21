import { Search, X, Smartphone } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

interface QuickFilter {
  name: string;
  icon: string;
  label: string;
}

const QUICK_FILTERS: QuickFilter[] = [
  { name: 'kotlin', icon: '/icons/technologies/kotlin.png', label: 'Kotlin' },
  { name: 'flutter', icon: '/icons/technologies/flutter.png', label: 'Flutter' },
  { name: 'mobile', icon: '', label: 'Mobile' }, // Will use Smartphone icon
];

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Check if any quick filter matches the current search value
  useEffect(() => {
    const matchingFilter = QUICK_FILTERS.find(
      (filter) => value.toLowerCase() === filter.name.toLowerCase()
    );
    setActiveFilter(matchingFilter?.name ?? null);
  }, [value]);

  const handleFilterClick = (filterName: string) => {
    if (activeFilter === filterName) {
      // If already active, clear the search
      onChange('');
      setActiveFilter(null);
    } else {
      // If not active, set the filter
      const filter = QUICK_FILTERS.find((f) => f.name === filterName);
      if (filter) {
        onChange(filter.label);
        setActiveFilter(filterName);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Rechercher une entreprise, mission ou technologie..."
            className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex gap-2">
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter.name}
              onClick={() => handleFilterClick(filter.name)}
              className={`flex items-center gap-2 px-3 py-3 rounded-lg border-2 transition-all ${
                activeFilter === filter.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              title={filter.label}
            >
              {filter.name === 'mobile' ? (
                <Smartphone className={`w-5 h-5 ${activeFilter === filter.name ? 'text-blue-500' : 'text-gray-600'}`} />
              ) : (
                <img
                  src={filter.icon}
                  alt={filter.label}
                  className="w-5 h-5"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
