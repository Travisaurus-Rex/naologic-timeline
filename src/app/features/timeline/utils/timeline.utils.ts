import {
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  startOfMonth,
  subDays,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  endOfMonth,
  endOfWeek,
} from 'date-fns';
import { WorkOrderDocument } from '../../../models/work-order';

export function calculateTimelineStart(
  orders: WorkOrderDocument[],
  mode: 'day' | 'week' | 'month' = 'day',
  paddingDays = 3,
): Date {
  if (!orders.length) return new Date();

  const earliest = Math.min(...orders.map((o) => new Date(o.data.startDate).getTime()));
  const date = subDays(new Date(earliest), paddingDays);

  switch (mode) {
    case 'month':
      return startOfMonth(date);
    case 'week':
      return startOfWeek(date);
    default:
      return date;
  }
}

export function calculateTimelineEnd(
  orders: WorkOrderDocument[],
  mode: 'day' | 'week' | 'month' = 'day',
  fallbackDays = 60,
  paddingDays = 3,
): Date {
  if (!orders.length) return addDays(new Date(), fallbackDays);

  const latest = Math.max(...orders.map((o) => new Date(o.data.endDate).getTime()));
  const date = addDays(new Date(latest), paddingDays);

  switch (mode) {
    case 'month':
      return endOfMonth(date);
    case 'week':
      return endOfWeek(date);
    default:
      return date;
  }
}

export function buildColumns(start: Date, end: Date, mode: 'day' | 'week' | 'month'): Date[] {
  const columns: Date[] = [];

  let current: Date;

  switch (mode) {
    case 'week':
      current = startOfWeek(start);
      while (current <= end) {
        columns.push(current);
        current = addWeeks(current, 1);
      }
      break;

    case 'month':
      current = startOfMonth(start);
      while (current <= end) {
        columns.push(current);
        current = addMonths(current, 1);
      }
      break;

    default:
      current = start;
      while (current <= end) {
        columns.push(current);
        current = addDays(current, 1);
      }
  }
  return columns;
}

export function calculateBarPositions(
  orders: WorkOrderDocument[],
  timelineStart: Date,
  pxPerDay: number,
) {
  return orders.map((order) => {
    const start = new Date(order.data.startDate);
    const end = new Date(order.data.endDate);

    const startDiff = differenceInDays(start, timelineStart);
    const duration = differenceInDays(end, start);

    return {
      order,
      left: startDiff * pxPerDay,
      width: Math.max(duration * pxPerDay, 2), // optional min width
    };
  });
}
