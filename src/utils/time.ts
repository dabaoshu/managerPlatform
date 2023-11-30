import dayjs from 'dayjs';

export const enum STR_FORMAT {
  "YYYY-MM-DD HH:mm:ss" = "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DD HH:mm" = "YYYY-MM-DD HH:mm",
  "YYYY-MM-DD" = "YYYY-MM-DD",
  "YYYY-MM" = "YYYY-MM",
}

export function formatDate(dataStr: dayjs.ConfigType, type: keyof typeof STR_FORMAT = STR_FORMAT['YYYY-MM-DD HH:mm:ss']) {
  return dayjs(dataStr).format(type);
}

/**
 * 获取昨天的开始结束时间
 */
export function getYesterday() {
  const date = [];
  date.push(dayjs().subtract(1, "day"));
  date.push(dayjs().subtract(1, "day"));
  return date;
}
/**
 * 获取最近七天的开始结束时间
 */
export function getLast7Days() {
  const date = [];
  date.push(dayjs().subtract(7, "day"));
  date.push(dayjs().subtract(1, 'day'));
  return date;
}

export function convertTimeBounds(timeFilter: [dayjs.Dayjs, dayjs.Dayjs, number]): { start: number, end: number } {
  const [start, end] = (timeFilter as dayjs.Dayjs[]).slice(0, 2).map(o => o?.valueOf());

  return {
    start, end,
    // duration,
  };
}