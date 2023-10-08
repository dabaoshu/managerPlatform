import moment from 'moment';

export const STR_FORMAT_1 = 'YYYY-MM-DD HH:mm:ss';
export const STR_FORMAT_2 = 'YYYY-MM-DD';
export const STR_FORMAT_3 = 'YYYY-MM-DD HH:mm';
export const STR_FORMAT_4 = 'YYYYMMDD';
export const STR_FORMAT_5 = 'YYYYMM';
export const STR_FORMAT_6 = 'YYYYWW'; // 周
export const STR_FORMAT_7 = 'YYYY-MM-DD HHmmss';
export const STR_FORMAT_8 = 'YYYY/MM/DD';

export const momentT = moment;

export function formatDate(dataStr = new Date(), type = 1) {
  let pattern;
  switch (type) {
    case 1:
      pattern = STR_FORMAT_1;
      break;
    case 2:
      pattern = STR_FORMAT_2;
      break;
    case 3:
      pattern = STR_FORMAT_3;
      break;
    case 4:
      pattern = STR_FORMAT_4;
      break;
    case 5:
      pattern = STR_FORMAT_5;
      break;
    case 6:
      pattern = STR_FORMAT_6;
      break;
    case 7:
      pattern = STR_FORMAT_7;
      break;
    case 8:
      pattern = STR_FORMAT_8;
      break;
    default:
      break;
  }
  return moment(dataStr).format(pattern);
}

export function getIntervalTime(type: number, val: any) {
  let format;
  let durationType;
  switch (type) {
    case 1:
      format = 'YYYY-MM-DD';
      durationType = 'days'; // hours, minutes, seconds
      break;
    case 2:
      format = 'YYYYWW';
      durationType = 'week';
      break;
    case 3:
      format = 'YYYYMM';
      durationType = 'month';
      break;
    default:
      break;
  }
  const dates = [];
  dates.push(moment(val[0]).format(format));
  const start = moment(val[0]);
  //@ts-ignore
  while (start.add(1, durationType) <= moment(val[1])) {
    dates.push(moment(start).format(format));
  }
  return dates.join(',');
}

export function getWeek(dateTime: string) {
  const onlyYear = moment(dateTime).year();
  const onlyWeek = moment(dateTime).weeks();
  return `${onlyYear}${onlyWeek}`;
}

export function prevOrNextTime(dateTime: number, num = 1, type = 'days', operType = 'prev') {
  let time;
  if (operType === 'prev') {
    //@ts-ignore
    time = moment(dateTime).subtract(num, type);
  } else {
    //@ts-ignore
    time = moment(dateTime).add(num, type);
  }
  return time;
}
// console.log(getWeek());
/**
 * 获取昨天的开始结束时间
 */
export function getYesterday() {
  const date = [];
  date.push(moment().subtract('days', 1).format(STR_FORMAT_2));
  date.push(moment().subtract('days', 1).format(STR_FORMAT_2));
  return date;
}
/**
 * 获取最近七天的开始结束时间
 */
export function getLast7Days() {
  const date = [];
  date.push(moment().subtract('days', 7).format(STR_FORMAT_2));
  date.push(moment().subtract('days', 1).format(STR_FORMAT_2));
  return date;
}
/**
 * 毫秒转为天、小时、分、秒
 */
export function formatDuring(duration: number) {
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);
  const ms = duration % 1000;
  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) {
        if (seconds === 0) {
          return `${ms}ms`;
        }
        return `${seconds}s ${ms}ms`;
      }
      return `${minutes}m ${seconds}s`;
    }
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
