import { addDays, differenceInDays, subDays } from 'date-fns';
import { WorkOrderDocument } from '../../../models/work-order';

export function calculateTimelineStart(orders: WorkOrderDocument[], paddingDays = 3): Date {
  if (!orders.length) return new Date();

  const earliest = Math.min(...orders.map((o) => new Date(o.data.startDate).getTime()));

  return subDays(new Date(earliest), paddingDays);
}

export function calculateTimelineEnd(
  orders: WorkOrderDocument[],
  fallbackDays = 60,
  paddingDays = 3,
): Date {
  if (!orders.length) return addDays(new Date(), fallbackDays);

  const latest = Math.max(...orders.map((o) => new Date(o.data.endDate).getTime()));

  return addDays(new Date(latest), paddingDays);
}

export function buildColumns(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function calculateBarPositions(
  orders: WorkOrderDocument[],
  timelineStart: Date,
  columnWidth: number,
) {
  return orders.map((order) => {
    const start = new Date(order.data.startDate);
    const end = new Date(order.data.endDate);

    return {
      order,
      left: differenceInDays(start, timelineStart) * columnWidth,
      width: differenceInDays(end, start) * columnWidth,
    };
  });
}
