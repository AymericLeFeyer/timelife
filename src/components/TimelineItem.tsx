import { TimelineItem as TimelineItemType, Event } from '../types/profile';
import { formatDate, calculateYOffset, PositionedItem, getDurationInMonths } from '../utils/timelineUtils';
import { Mic, GraduationCap, Briefcase, Code } from 'lucide-react';

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

  if (isEvent || isShortEvent) {
    let Icon;
    let bgGradient;

    const shouldGrayOut = isSearchActive && !matchesSearch;

    if (isEvent) {
      const eventData = item.data as Event;
      Icon = eventData.type === 'talk' ? Mic : GraduationCap;
      bgGradient = shouldGrayOut ? 'from-gray-400 to-gray-500' : 'from-amber-500 to-amber-600';
    } else if (item.type === 'company') {
      Icon = Briefcase;
      bgGradient = shouldGrayOut ? 'from-gray-400 to-gray-500' : 'from-green-500 to-green-600';
    } else {
      Icon = Code;
      bgGradient = shouldGrayOut ? 'from-gray-400 to-gray-500' : 'from-blue-500 to-blue-600';
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
        <div className="relative flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${bgGradient} shadow-lg flex items-center justify-center transform transition-transform group-hover:scale-125 border-2 border-white`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
              <div className="font-semibold">{item.title}</div>
              <div className="text-gray-300 text-[10px] mt-0.5">{item.subtitle}</div>
              <div className="text-gray-300 text-[10px] mt-0.5">{formatDate(item.startDate)}</div>
            </div>
          </div>
        </div>
      </button>
    );
  }

  const displayTitle = item.subtitle ? `${item.subtitle} - ${item.title}` : item.title;
  const shouldGrayOut = isSearchActive && !matchesSearch;
  const bgColor = shouldGrayOut ? '#9ca3af' : item.color;

  return (
    <button
      onClick={onClick}
      className="absolute h-14 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
      style={{
        left: `${position}px`,
        width: `${width}px`,
        top: `${topOffset}px`,
        backgroundColor: bgColor,
      }}
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
      <div className="h-full flex flex-col justify-center px-3 text-white">
        <div className="text-sm font-semibold truncate">{displayTitle}</div>
        {width > 80 && (
          <div className="text-xs opacity-90 truncate">
            {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Présent'}
          </div>
        )}
      </div>
      {!item.endDate && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </div>
      )}
    </button>
  );
};
