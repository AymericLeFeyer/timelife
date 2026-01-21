import { TimelineItem as TimelineItemType, Event } from '../types/profile';
import { formatDate, calculateYOffset, PositionedItem, getDurationInMonths } from '../utils/timelineUtils';
import { Mic, GraduationCap, Trophy, Briefcase, Code } from 'lucide-react';
import companiesData from '../data/companies.json';
import technologiesData from '../data/technologies.json';

interface TimelineItemProps {
  item: TimelineItemType;
  position: number;
  width: number;
  onClick: () => void;
  isVertical: boolean;
  level: number;
  allPositionedItems?: PositionedItem[];
  swimlanePadding?: number;
  matchesSearch?: boolean;
  isSearchActive?: boolean;
}

export const TimelineItemComponent = ({
  item,
  position,
  width,
  onClick,
  isVertical,
  level,
  allPositionedItems = [],
  swimlanePadding = 0,
  matchesSearch = true,
  isSearchActive = false,
}: TimelineItemProps) => {
  const isEvent = item.type === 'event';
  const actualEndDate = item.endDate || item.startDate;
  const duration = getDurationInMonths(item.startDate, actualEndDate);
  const isShortEvent = (item.type === 'mission' || item.type === 'company') && duration <= 1 && item.endDate !== null;

  if (isVertical) {
    return (
      <div className="flex gap-4 mb-8">
        <div className="flex flex-col items-center">
          <div
            className="w-4 h-4 rounded-full border-4 border-white shadow-lg flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          {!isEvent && <div className="w-1 h-full bg-gray-200 mt-2" />}
        </div>
        <div className="flex-1 pb-8">
          <button
            onClick={onClick}
            className="text-left w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 border-l-4"
            style={{ borderLeftColor: item.color }}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatDate(item.startDate)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{item.subtitle}</p>
            {!isEvent && item.endDate && (
              <p className="text-xs text-gray-500">
                jusqu'à {formatDate(item.endDate)}
              </p>
            )}
            {!isEvent && !item.endDate && (
              <span className="text-xs text-blue-600 font-medium">En cours</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  const ITEM_HEIGHT = 70;
  const TOP_PADDING = 80;

  const topOffset = calculateYOffset(level, allPositionedItems, ITEM_HEIGHT, TOP_PADDING, swimlanePadding);

  // Check if it's a very short item (1-2 months) that should show as an icon
  // OR if it's an event (always show as icon)
  // OR if it's too narrow due to zoom level (less than 100px width)
  const isVeryShortItem = ((item.type === 'mission' || item.type === 'company' || item.type === 'event' || item.type === 'education') && item.endDate !== null) && width < 100;

  // Resolve company icon for missions and companies
  let companyIcon: string | undefined = undefined;
  if ((item.type === 'company' || item.type === 'mission') && item.subtitle) {
    const found = companiesData.find((c: any) => c.name === item.subtitle || c.name.toLowerCase() === item.subtitle.toLowerCase());
    if (found && found.icon) companyIcon = found.icon;
  }

  // Show simple icon for very short items
  if (isVeryShortItem) {
    let Icon;
    let bgColor;
    let iconColor;
    let technologyIcon: string | undefined = undefined;

    const shouldGrayOut = isSearchActive && !matchesSearch;

    // Check for icon in education/event data first
    if (item.type === 'education') {
      const education = item.data as any;
      if (education.icon) {
        technologyIcon = education.icon;
      }
    } else if (item.type === 'event') {
      const event = item.data as Event;
      if (event.icon) {
        technologyIcon = event.icon;
      }
    }

    if (isEvent) {
      const eventData = item.data as Event;
      Icon = eventData.type === 'talk' ? Mic : Trophy;
      bgColor = shouldGrayOut ? '#d1d5db' : `${item.color}40`;
      iconColor = shouldGrayOut ? '#9ca3af' : item.color;
    } else if (item.type === 'company') {
      Icon = Briefcase;
      bgColor = shouldGrayOut ? '#d1d5db' : '#10b98140';
      iconColor = shouldGrayOut ? '#9ca3af' : '#10b981';
    } else if (item.type === 'education') {
      Icon = GraduationCap;
      bgColor = shouldGrayOut ? '#d1d5db' : `${item.color}40`;
      iconColor = shouldGrayOut ? '#9ca3af' : item.color;
    }else {
      Icon = Code;
      bgColor = shouldGrayOut ? '#d1d5db' : '#3b82f640';
      iconColor = shouldGrayOut ? '#9ca3af' : '#3b82f6';
    }

    return (
      <button
        onClick={onClick}
        className="absolute group z-20"
        style={{
          left: `${position - 12}px`,
          top: `${topOffset}px`,
        }}
      >
        <div className="relative flex flex-col items-center mt-7">
          <div className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center transform transition-all group-hover:scale-125 border-2 border-white" style={{ backgroundColor: bgColor, opacity: shouldGrayOut ? 0.6 : 1 }}>
            {technologyIcon ? (
              <img src={technologyIcon} alt="" className="w-5 h-5 object-contain" style={{ zIndex: 1, filter: shouldGrayOut ? 'grayscale(1) brightness(0.9)' : 'none' }} />
            ) : companyIcon ? (
              <img src={companyIcon} alt="" className="w-5 h-5 object-contain" style={{ zIndex: 1, filter: shouldGrayOut ? 'grayscale(1) brightness(0.9)' : 'none' }} />
            ) : (
              <Icon className="w-4 h-4" style={{ color: iconColor }} />
            )}
          </div>
        
        </div>
      </button>
    );
  }

  const displayTitle = item.title;
  const shouldGrayOut = isSearchActive && !matchesSearch;

  // Resolve icon path for company/mission items using companies.json
  const companies = (companiesData as Array<{ name: string; icon: string }>);
  let resolvedIcon: string | undefined = undefined;
  if (item.type === 'company' || item.type === 'mission') {
    const companyName = item.subtitle;
    const found = companies.find(c => c.name === companyName || c.name.toLowerCase() === companyName.toLowerCase());
    if (found && found.icon) resolvedIcon = found.icon;
  }

  // Resolve icon for education and events
  let educationEventIcon: string | undefined = undefined;
  if (item.type === 'education') {
    const education = item.data as any;
    if (education.icon) {
      educationEventIcon = education.icon;
    }
  } else if (item.type === 'event') {
    const event = item.data as Event;
    if (event.icon) {
      educationEventIcon = event.icon;
    }
  }

  // If no custom icon, check for technology name
  if (!educationEventIcon && (item.type === 'event' || item.type === 'education')) {
    const textToSearch = item.title.toLowerCase();
    const tech = (technologiesData as any[]).find((t: any) =>
      textToSearch.includes(t.name.toLowerCase())
    );
    if (tech && tech.icon) {
      educationEventIcon = tech.icon;
    }
  }

  const bgColor = shouldGrayOut ? '#d1d5db' : `${item.color}40`;

  return (
    <button
      onClick={onClick}
      className="absolute h-14 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
      style={{
        left: `${position}px`,
        width: `${width}px`,
        top: `${topOffset}px`,
        backgroundColor: bgColor,
        marginTop: '16px',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: item.color }} />
      <div className="h-full flex items-center justify-center gap-2 px-3 relative z-10" style={{ color: shouldGrayOut ? '#6b7280' : '#000' }}>
        {/** Optional icon from public folder: render only if resolvedIcon exists */}
        {resolvedIcon && (
          <img
            src={resolvedIcon}
            alt=""
            className="w-6 h-6 object-contain flex-shrink-0"
            style={{ filter: shouldGrayOut ? 'grayscale(1) brightness(0.9)' : 'none' }}
          />
        )}

        {/** Optional icon for education/events */}
        {!resolvedIcon && educationEventIcon && (
          <img
            src={educationEventIcon}
            alt=""
            className="w-6 h-6 object-contain flex-shrink-0"
            style={{ filter: shouldGrayOut ? 'grayscale(1) brightness(0.9)' : 'none' }}
          />
        )}

        <div className="flex flex-col justify-center min-w-0">
          <div className="text-sm font-semibold truncate">{displayTitle}</div>
          {width > 80 && !isShortEvent && (
            <div className="text-xs truncate" style={{ color: shouldGrayOut ? '#9ca3af' : '#000' }}>
              {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Aujourd\'hui'}
            </div>
          )}
        </div>
      </div>
      {!item.endDate && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: item.color }} />
        </div>
      )}
    </button>
  );
};
