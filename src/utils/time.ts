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

export function convertTimeBounds(timeFilter): { min: number, max: number } {
  const [start, end] = timeFilter.map(o => o);

  return {
    min: start.timestamp,
    max: end.timestamp,
    // duration: moment.duration(end.timestamp - start.timestamp),
  };
}