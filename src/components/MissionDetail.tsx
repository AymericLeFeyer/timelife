import { X, Calendar, Briefcase, GraduationCap, Mic, Trophy, Underline } from 'lucide-react';
import { TimelineItem } from '../types/profile';
import { formatDate } from '../utils/timelineUtils';
import { formatFrequency } from '../utils/frequencyUtils';
import type { Mission, Company, Education, Event } from '../types/profile';
import companiesData from '../data/companies.json';
import technologiesData from '../data/technologies.json';

interface MissionDetailProps {
  item: TimelineItem | null;
  onClose: () => void;
}

export const MissionDetail = ({ item, onClose }: MissionDetailProps) => {
  if (!item) return null;

  // Resolve company icon if mission or company type
  let companyIcon: string | undefined = undefined;
  if ((item.type === 'mission' || item.type === 'company') && item.subtitle) {
    const companies = (companiesData as Array<{ name: string; icon: string }>);
    const found = companies.find(c => c.name === item.subtitle || c.name.toLowerCase() === item.subtitle.toLowerCase());
    if (found && found.icon) companyIcon = found.icon;
  }

  // Resolve technology/custom icon for education and events
  let customIcon: string | undefined = undefined;
  if (item.type === 'education') {
    const education = item.data as any;
    if (education.icon) {
      customIcon = education.icon;
    }
  } else if (item.type === 'event') {
    const event = item.data as Event;
    if (event.icon) {
      customIcon = event.icon;
    }
  }

  // If no custom icon, check for technology name
  if (!customIcon && (item.type === 'event' || item.type === 'education')) {
    const textToSearch = item.title.toLowerCase();
    const tech = (technologiesData as any[]).find((t: any) =>
      textToSearch.includes(t.name.toLowerCase())
    );
    if (tech && tech.icon) {
      customIcon = tech.icon;
    }
  }

  const renderIcon = () => {
    // Use custom icon if available
    if (customIcon) {
      return <img src={customIcon} alt="" className="w-6 h-6 object-contain" />;
    }

    // Use company icon if available
    if (companyIcon) {
      return <img src={companyIcon} alt="" className="w-6 h-6 object-contain" />;
    }

    // Fall back to default icons
    switch (item.type) {
      case 'mission':
        return <Briefcase className="w-6 h-6" />;
      case 'company':
        return <Briefcase className="w-6 h-6" />;
      case 'education':
        return <GraduationCap className="w-6 h-6" />;
      case 'event':
        const event = item.data as Event
        const Icon = event.type === 'talk' ? Mic : Trophy;
        return <Icon className="w-6 h-6" />;
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case 'mission':
        return <MissionContent mission={item.data as Mission} />;
      case 'company':
        return <CompanyContent company={item.data as Company} />;
      case 'education':
        return <div/>;
      case 'event':
        return <EventContent event={item.data as Event} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
              {renderIcon()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
              <p className="text-gray-600 mt-1">{item.subtitle}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(item.startDate)}
                  {' - '}
                  {item.endDate ? formatDate(item.endDate) : 'Aujourd\'hui'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {item.type !== 'education' && <div className="p-6">{renderContent()}</div>}
      </div>
    </div>
  );
};

const MissionContent = ({ mission }: { mission: Mission }) => {
  const technologies = (technologiesData as Array<{ name: string; icon: string }>);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Contexte</h3>
        <p className="text-gray-700 leading-relaxed">{mission.context}</p>
      </div>

      {mission.link && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Liens</h3>
          <a href={mission.link.url} target='_blank' className="text-blue-600 underline hover:text-blue-800 transition-colors">{mission.link.text}</a>
        </div>
      )}

      {mission.tasks && mission.tasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tâches</h3>
          <ul className="space-y-2">
            {mission.tasks.map((task, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span className="text-gray-700">{task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mission.technologies && mission.technologies.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies</h3>
          <div className="space-y-3">
            {mission.technologies.map((tech, idx) => {
              const techData = technologies.find(t => t.name === tech.name || t.name.toLowerCase() === tech.name.toLowerCase());
              return (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {techData && techData.icon && (
                        <img src={techData.icon} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
                      )}
                      <span className="font-medium text-gray-900">{tech.name}</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {Math.round((Number(tech.frequency) || 0) * 100)}% - {formatFrequency(tech.frequency)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{tech.comments}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const CompanyContent = ({ company }: { company: Company }) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Responsabilités</h3>
      <ul className="space-y-2">
        {company.responsibilities.map((resp, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
            <span className="text-gray-700">{resp}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);



const EventContent = ({ event }: { event: Event }) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
      <p className="text-gray-700">{event.description}</p>
    </div>
   
  </div>
);
