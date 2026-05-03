import {
  differenceInHours,
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isBefore,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Hoy';
  if (isTomorrow(date)) return 'Manana';
  return format(date, "d MMM", { locale: es });
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: es });
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function getHoursUntilDue(dueDate: string): number {
  return differenceInHours(new Date(dueDate), new Date());
}

export function getWeekDays() {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map(d => ({
    date: format(d, 'yyyy-MM-dd'),
    label: format(d, 'EEE', { locale: es }).replace('.', ''),
    isToday: isToday(d),
  }));
}
