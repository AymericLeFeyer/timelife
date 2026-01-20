import { Profile, TimelineItem } from '../types/profile';

export const parseDate = (dateString: string): Date => {
  if (dateString === 'Present') {
    return new Date();
  }
  const [year, month] = dateString.split('-');
  return new Date(parseInt(year), parseInt(month) - 1);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
};

export const getDurationInMonths = (start: Date, end: Date): number => {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
};

const colors = {
  mission: '#3b82f6',
  company: '#10b981',
  education: '#f59e0b',
  event: '#f59e0b',
};

export const createTimelineItems = (profile: Profile): TimelineItem[] => {
  const items: TimelineItem[] = [];

  profile.missions.forEach((mission, idx) => {
    items.push({
      id: `mission-${idx}`,
      type: 'mission',
      title: mission.title,
      subtitle: mission.company,
      startDate: parseDate(mission.start_date),
      endDate: mission.end_date === 'Present' ? null : parseDate(mission.end_date),
      data: mission,
      color: colors.mission,
    });
  });

  profile.companies.forEach((company, idx) => {
    items.push({
      id: `company-${idx}`,
      type: 'company',
      title: company.position,
      subtitle: company.company,
      startDate: parseDate(company.start_date),
      endDate: company.end_date === 'Present' ? null : parseDate(company.end_date),
      data: company,
      color: colors.company,
    });
  });

  profile.education.forEach((edu, idx) => {
    items.push({
      id: `education-${idx}`,
      type: 'education',
      title: edu.degree,
      subtitle: edu.institution,
      startDate: parseDate(edu.start_date),
      endDate: parseDate(edu.end_date),
      data: edu,
      color: colors.education,
    });
  });

  profile.events.forEach((event, idx) => {
    const eventDate = parseDate(event.date);
    items.push({
      id: `event-${idx}`,
      type: 'event',
      title: event.name,
      subtitle: event.type,
      startDate: eventDate,
      endDate: eventDate,
      data: event,
      color: colors.event,
    });
  });

  return items.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

export const getTimelineBounds = (items: TimelineItem[]): { min: Date; max: Date } => {
  const allDates = items.flatMap((item) => [
    item.startDate,
    item.endDate || new Date(),
  ]);

  return {
    min: new Date(Math.min(...allDates.map((d) => d.getTime()))),
    max: new Date(Math.max(...allDates.map((d) => d.getTime()))),
  };
};

export const calculatePosition = (
  date: Date,
  minDate: Date,
  maxDate: Date,
  containerWidth: number
): number => {
  const totalMonths = getDurationInMonths(minDate, maxDate);
  const monthsSinceStart = getDurationInMonths(minDate, date);
  return (monthsSinceStart / totalMonths) * containerWidth;
};

export const calculateWidth = (
  startDate: Date,
  endDate: Date | null,
  minDate: Date,
  maxDate: Date,
  containerWidth: number
): number => {
  const actualEndDate = endDate || new Date();
  const duration = getDurationInMonths(startDate, actualEndDate);
  const totalMonths = getDurationInMonths(minDate, maxDate);
  return Math.max((duration / totalMonths) * containerWidth, 4);
};

export interface PositionedItem {
  item: TimelineItem;
  position: number;
  width: number;
  level: number;
}

const doItemsOverlap = (
  pos1: number,
  width1: number,
  pos2: number,
  width2: number
): boolean => {
  return pos1 < pos2 + width2 && pos2 < pos1 + width1;
};

const getSwimlane = (itemType: string): number => {
  switch (itemType) {
    case 'mission':
      return 0;
    case 'company':
      return 1;
    case 'event':
      return 2;
    case 'education':
      return 3;
    default:
      return 0;
  }
};

export const assignLevels = (
  items: TimelineItem[],
  minDate: Date,
  maxDate: Date,
  containerWidth: number
): PositionedItem[] => {
  const positionedItems: PositionedItem[] = [];

  // Trier par swimlane puis par date de début
  const sortedItems = [...items].sort((a, b) => {
    const swimlaneA = getSwimlane(a.type);
    const swimlaneB = getSwimlane(b.type);

    if (swimlaneA !== swimlaneB) {
      return swimlaneA - swimlaneB;
    }

    return a.startDate.getTime() - b.startDate.getTime();
  });

  const swimlaneRows = new Map<number, number>();

  sortedItems.forEach(item => {
    const position = calculatePosition(item.startDate, minDate, maxDate, containerWidth);
    const width = calculateWidth(item.startDate, item.endDate, minDate, maxDate, containerWidth);
    const baseSwimlane = getSwimlane(item.type);

    // Déterminer si c'est un événement court (1 mois ou moins pour missions/companies AVEC date de fin)
    const duration = item.endDate ? getDurationInMonths(item.startDate, item.endDate) : Infinity;
    const isShortEvent = (item.type === 'mission' || item.type === 'company') && duration <= 1 && item.endDate !== null;

    // Pour les missions et companies, utiliser le champ row s'il existe
    if ((item.type === 'mission' || item.type === 'company') && 'row' in item.data && item.data.row) {
      const rowInSwimlane = item.data.row - 1; // row 1 → ligne 0, row 2 → ligne 1
      const testLevel = baseSwimlane + rowInSwimlane / 100;
      const actualWidth = isShortEvent ? 4 : width;
      positionedItems.push({ item, position, width: actualWidth, level: testLevel });
      const currentMax = swimlaneRows.get(baseSwimlane) || 0;
      swimlaneRows.set(baseSwimlane, Math.max(currentMax, rowInSwimlane + 1));
    } else {
      // Pour les autres types, utiliser l'algorithme de placement automatique
      let rowInSwimlane = 0;
      let foundLevel = false;

      while (!foundLevel) {
        const testLevel = baseSwimlane + rowInSwimlane / 100;
        const itemsInSwimlane = positionedItems.filter(
          pi => Math.floor(pi.level) === baseSwimlane
        );
        const itemsInRow = itemsInSwimlane.filter(
          pi => Math.abs(pi.level - testLevel) < 0.001
        );
        const hasOverlap = itemsInRow.some(pi =>
          doItemsOverlap(position, width, pi.position, pi.width)
        );

        if (!hasOverlap) {
          foundLevel = true;
          const actualWidth = (item.type === 'event' || isShortEvent) ? 4 : width;
          positionedItems.push({ item, position, width: actualWidth, level: testLevel });
          const currentMax = swimlaneRows.get(baseSwimlane) || 0;
          swimlaneRows.set(baseSwimlane, Math.max(currentMax, rowInSwimlane + 1));
        } else {
          rowInSwimlane += 1;
        }
      }
    }
  });

  return positionedItems;
};

export const calculateYOffset = (
  level: number,
  positionedItems: PositionedItem[],
  itemHeight: number,
  topPadding: number,
  swimlanePadding: number = 0
): number => {
  const baseSwimlane = Math.floor(level);
  const rowInSwimlane = Math.round((level - baseSwimlane) * 100);

  const getRowsInSwimlane = (swimlaneId: number): number => {
    const itemsInSwimlane = positionedItems.filter(
      pi => Math.floor(pi.level) === swimlaneId
    );
    if (itemsInSwimlane.length === 0) return 1;
    const maxRow = Math.max(...itemsInSwimlane.map(pi => Math.round((pi.level - swimlaneId) * 100)));
    return maxRow + 1;
  };

  const swimlaneHeights = [0, 1, 2, 3].map(id => getRowsInSwimlane(id) * itemHeight + swimlanePadding);
  const yOffsetForSwimlane = topPadding + swimlaneHeights
    .slice(0, baseSwimlane)
    .reduce((sum, h) => sum + h, 0);

  return yOffsetForSwimlane + rowInSwimlane * itemHeight;
};
