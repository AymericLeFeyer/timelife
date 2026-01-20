import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { Contact } from '../types/profile';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  name: string;
  role: string;
  contacts: Contact;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export const Header = ({ name, role, contacts, searchQuery = '', onSearchChange = () => {} }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 px-8 py-4">
      <div className="flex items-center gap-8">
        {/* Left: Name and Role */}
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{name}</h1>
          <p className="text-lg text-gray-600">{role}</p>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl">
            <SearchBar value={searchQuery} onChange={onSearchChange} />
          </div>
        </div>

        {/* Right: Contacts */}
        <div className="flex-shrink-0 flex flex-wrap gap-2 justify-end">
          <a
            href={`mailto:${contacts.email}`}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm text-gray-700"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Email</span>
          </a>
        
          <a
            href={contacts.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            <Linkedin className="w-4 h-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
          <a
            href={`https://github.com/${contacts.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
};
