import { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TimelineItem as TimelineItemType } from '../types/profile';
import { TimelineItemComponent } from './TimelineItem';
import { MissionDetail } from './MissionDetail';
import { useTimeline } from '../hooks/useTimeline';
import {
  getTimelineBounds,
  getDurationInMonths,
  formatDate,
  assignLevels,
  calculatePosition,
} from '../utils/timelineUtils';

interface TimelineProps {
  items: TimelineItemType[];
  searchQuery?: string;
}

const itemMatchesSearch = (item: TimelineItemType, query: string): boolean => {
  if (!query.trim()) return true;

  const lowerQuery = query.toLowerCase();

  if (item.title.toLowerCase().includes(lowerQuery)) return true;
  if (item.subtitle?.toLowerCase().includes(lowerQuery)) return true;

  // Search in mission-specific fields
  if (item.type === 'mission' && 'technologies' in item.data) {
    const mission = item.data as any;
    
    // Search in context
    if (mission.context?.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in technologies
    if (mission.technologies && Array.isArray(mission.technologies)) {
      if (mission.technologies.some((tech: any) =>
        tech.name?.toLowerCase().includes(lowerQuery) ||
        tech.comments?.toLowerCase().includes(lowerQuery)
      )) {
        return true;
      }
    }
    
    // Search in tasks
    if (mission.tasks && Array.isArray(mission.tasks)) {
      if (mission.tasks.some((task: any) =>
        task?.toLowerCase?.().includes(lowerQuery)
      )) {
        return true;
      }
    }
  }

  // Search in company-specific fields
  if (item.type === 'company') {
    const company = item.data as any;
    
    // Search in responsibilities
    if (company.responsibilities && Array.isArray(company.responsibilities)) {
      if (company.responsibilities.some((resp: any) =>
        resp?.toLowerCase?.().includes(lowerQuery)
      )) {
        return true;
      }
    }
  }

  return false;
};

export const Timeline = ({ items, searchQuery = '' }: TimelineProps) => {
  const { zoom, containerRef, zoomIn, zoomOut, resetZoom } = useTimeline();
  const [selectedItem, setSelectedItem] = useState<TimelineItemType | null>(null);
  const [isVertical, setIsVertical] = useState(false);
  const hasScrolledToEnd = useRef(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsVertical(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const bounds = getTimelineBounds(items);
  const baseWidth = 3000;
  const sidePadding = typeof window !== 'undefined' ? window.innerWidth / 2 : 400;
  const timelineWidth = baseWidth * zoom;
  const totalWidth = timelineWidth + sidePadding * 2;

  const positionedItems = assignLevels(items, bounds.min, bounds.max, timelineWidth);

  useEffect(() => {
    if (!isVertical && containerRef.current && positionedItems.length > 0 && !hasScrolledToEnd.current) {
      const timer = setTimeout(() => {
        if (containerRef.current) {
          const lastItem = positionedItems[positionedItems.length - 1];
          const lastItemEnd = lastItem.position + lastItem.width + sidePadding;
          const scrollTarget = lastItemEnd - containerRef.current.clientWidth + 200;

          containerRef.current.scrollTo({
            left: scrollTarget,
            behavior: 'smooth'
          });
          hasScrolledToEnd.current = true;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVertical, positionedItems, sidePadding]);

  const ITEM_HEIGHT = 70;
  const TOP_PADDING = 80;
  const BOTTOM_PADDING = 40;
  const HEADER_HEIGHT = 220;
  const SWIMLANE_PADDING = 20;

  const swimlaneConfig = [
    { id: 0, label: 'Missions' },
    { id: 1, label: 'Entreprises' },
    { id: 2, label: 'Événements' },
    { id: 3, label: 'Formations' },
  ];

  const getRowsInSwimlane = (swimlaneId: number): number => {
    const itemsInSwimlane = positionedItems.filter(
      pi => Math.floor(pi.level) === swimlaneId
    );
    if (itemsInSwimlane.length === 0) return 1;
    const maxRow = Math.max(...itemsInSwimlane.map(pi => Math.round((pi.level - swimlaneId) * 100)));
    return maxRow + 1;
  };

  const swimlaneHeights = swimlaneConfig.map(sw => ({
    id: sw.id,
    label: sw.label,
    rows: getRowsInSwimlane(sw.id),
    height: getRowsInSwimlane(sw.id) * ITEM_HEIGHT + SWIMLANE_PADDING
  }));

  const contentHeight = TOP_PADDING +
    swimlaneHeights.reduce((sum, sw) => sum + sw.height, 0) +
    BOTTOM_PADDING;

  const generateMonthMarkers = () => {
    const markers: { date: Date; position: number }[] = [];
    const totalMonths = getDurationInMonths(bounds.min, bounds.max);
    const step = zoom < 0.7 ? 12 : zoom < 1.2 ? 6 : 3;

    for (let i = 0; i <= totalMonths; i += step) {
      const date = new Date(bounds.min);
      date.setMonth(date.getMonth() + i);
      const position = calculatePosition(date, bounds.min, bounds.max, timelineWidth) + sidePadding;
      markers.push({ date, position });
    }

    return markers;
  };

  if (isVertical) {
    return (
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Timeline</h1>
            <p className="text-gray-600">Mon parcours professionnel</p>
          </div>
          <div className="relative">
            {items.map((item) => (
              <TimelineItemComponent
                key={item.id}
                item={item}
                position={0}
                width={0}
                onClick={() => setSelectedItem(item)}
                isVertical={true}
                level={0}
                matchesSearch={itemMatchesSearch(item, searchQuery)}
                isSearchActive={searchQuery.trim().length > 0}
              />
            ))}
          </div>
        </div>
        <MissionDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed right-4 z-30 flex items-center gap-1 bg-white/95 backdrop-blur rounded-lg shadow-lg p-1 border border-gray-300"
        style={{ top: `${HEADER_HEIGHT}px` }}
      >
        <button
          onClick={zoomOut}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
          title="Dézoomer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={resetZoom}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
          title="Réinitialiser"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={zoomIn}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
          title="Zoomer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-x-auto overflow-y-hidden bg-gradient-to-br from-gray-50 to-gray-100"
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          paddingTop: `calc((100vh - ${HEADER_HEIGHT}px - ${contentHeight}px) / 2)`,
          paddingBottom: `calc((100vh - ${HEADER_HEIGHT}px - ${contentHeight}px) / 2)`
        }}
      >
        <div
          className="relative"
          style={{ width: `${totalWidth}px`, minWidth: '100%', height: `${contentHeight}px` }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
            style={{ left: '20px', width: `${sidePadding - 40}px` }}
          >
            <div className="text-gray-400 text-sm italic text-center">
              Avant ça je jouais à Dofus, ça t'intéresse ?
            </div>
            <div className="mt-2 text-gray-300 text-xs">✨</div>
          </div>

          <div
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
            style={{
              left: `${timelineWidth + sidePadding + 20}px`,
              width: `${sidePadding - 40}px`
            }}
          >
            <div className="text-gray-400 text-sm italic text-center">
              Le meilleur reste à venir
            </div>
            <div className="mt-2 text-gray-300 text-xs">🚀</div>
          </div>

          {swimlaneHeights.map((swimlane, idx) => {
            const yOffset = TOP_PADDING + swimlaneHeights
              .slice(0, idx)
              .reduce((sum, sw) => sum + sw.height, 0);

            return (
              <div key={swimlane.id}>
                <div
                  className="absolute border-t-2 border-gray-400"
                  style={{
                    left: `${sidePadding}px`,
                    width: `${timelineWidth}px`,
                    top: `${yOffset}px`,
                  }}
                />
                <div
                  className="absolute text-sm font-semibold text-gray-700"
                  style={{
                    left: `${sidePadding - 120}px`,
                    top: `${yOffset + swimlane.height / 2 - 10}px`,
                    width: '100px',
                    textAlign: 'right'
                  }}
                >
                  {swimlane.label}
                </div>
              </div>
            );
          })}
          <div
            className="absolute border-t-2 border-gray-400"
            style={{
              left: `${sidePadding}px`,
              width: `${timelineWidth}px`,
              top: `${TOP_PADDING + swimlaneHeights.reduce((sum, sw) => sum + sw.height, 0)}px`,
            }}
          />

          {generateMonthMarkers().map((marker, idx) => (
            <div
              key={idx}
              className="absolute flex flex-col items-center"
              style={{ left: `${marker.position}px`, top: 0, height: `${contentHeight}px` }}
            >
              <div className="w-px h-full bg-gray-300/50" />
              <span className="absolute text-xs font-medium text-gray-600 whitespace-nowrap bg-white/80 px-2 py-1 rounded shadow-sm" style={{ top: `${TOP_PADDING - 35}px` }}>
                {formatDate(marker.date)}
              </span>
            </div>
          ))}

          {positionedItems.map((posItem) => (
            <TimelineItemComponent
              key={posItem.item.id}
              item={posItem.item}
              position={posItem.position + sidePadding}
              width={posItem.width}
              onClick={() => setSelectedItem(posItem.item)}
              isVertical={false}
              level={posItem.level}
              allPositionedItems={positionedItems}
              swimlanePadding={SWIMLANE_PADDING}
              matchesSearch={itemMatchesSearch(posItem.item, searchQuery)}
              isSearchActive={searchQuery.trim().length > 0}
            />
          ))}

          {(() => {
            const today = new Date();
            const todayPosition = calculatePosition(today, bounds.min, bounds.max, timelineWidth) + sidePadding;
            return (
              <div
                className="absolute"
                style={{ left: `${todayPosition}px`, top: 0, height: `${contentHeight}px` }}
              >
                <div className="w-0.5 h-full bg-red-500" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="text-red-500 text-sm font-semibold whitespace-nowrap">
                    Aujourd'hui
                  </div>
                  <div className="text-red-500 text-xl">↓</div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <MissionDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};
