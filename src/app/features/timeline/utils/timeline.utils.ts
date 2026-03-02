import {
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  startOfMonth,
  subDays,
  differenceInDays,
  endOfMonth,
  endOfWeek,
} from 'date-fns';
import { WorkOrderDocument } from '../../../models/work-order';

export function calculateTimelineStart(orders: WorkOrderDocument[]): Date {
  if (!orders.length) return new Date();
  const earliest = Math.min(...orders.map((o) => new Date(o.data.startDate).getTime()));
  return new Date(
    Date.UTC(
      new Date(earliest).getUTCFullYear(),
      new Date(earliest).getUTCMonth(),
      new Date(earliest).getUTCDate(),
    ),
  );
}

export function calculateTimelineEnd(orders: WorkOrderDocument[], fallbackDays = 60): Date {
  if (!orders.length) return addDays(new Date(), fallbackDays);
  const latest = Math.max(...orders.map((o) => new Date(o.data.endDate).getTime()));
  return new Date(
    Date.UTC(
      new Date(latest).getUTCFullYear(),
      new Date(latest).getUTCMonth(),
      new Date(latest).getUTCDate(),
    ),
  );
}

export function buildColumns(start: Date, end: Date, mode: 'day' | 'week' | 'month'): Date[] {
  const columns: Date[] = [];
  let current: Date = start;

  switch (mode) {
    case 'week':
      while (current <= end) {
        columns.push(current);
        current = addWeeks(current, 1);
      }
      break;
    case 'month':
      while (current <= end) {
        columns.push(current);
        current = addMonths(current, 1);
      }
      break;
    default:
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
    const [sy, sm, sd] = order.data.startDate.split('-').map(Number);
    const [ey, em, ed] = order.data.endDate.split('-').map(Number);
    const start = new Date(Date.UTC(sy, sm - 1, sd));
    const end = new Date(Date.UTC(ey, em - 1, ed));

    const startDiff = differenceInDays(start, timelineStart);
    const duration = differenceInDays(end, start);

    return {
      order,
      left: startDiff * pxPerDay,
      width: Math.max(duration * pxPerDay, 2),
    };
  });
}
