import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Profile } from '../types/profile';

const API_BASE = 'https://api.aymeric.lefeyer.fr';

export interface CompanyIcon {
  name: string;
  icon: string;
}

export interface TechnologyIcon {
  name: string;
  icon: string;
  category: string;
}

interface AppData {
  profile: Profile | null;
  companies: CompanyIcon[];
  technologies: TechnologyIcon[];
  loading: boolean;
  error: string | null;
}

const AppDataContext = createContext<AppData>({
  profile: null,
  companies: [],
  technologies: [],
  loading: true,
  error: null,
});

export const useAppData = () => useContext(AppDataContext);

export function getCdnUrl(path: string): string {
  if (!path || path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [companies, setCompanies] = useState<CompanyIcon[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/profile`).then(r => r.json()),
      fetch(`${API_BASE}/api/companies`).then(r => r.json()),
      fetch(`${API_BASE}/api/technologies`).then(r => r.json()),
    ])
      .then(([profileData, companiesData, technologiesData]) => {
        setProfile(profileData);
        setCompanies(companiesData);
        setTechnologies(technologiesData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppDataContext.Provider value={{ profile, companies, technologies, loading, error }}>
      {children}
    </AppDataContext.Provider>
  );
};
