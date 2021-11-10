/**
 * 独立的时间操作工具，方便后续切换到dayjs
 */
import moment from 'moment';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD ';

export function formatToDateTime(date = null, format = DATE_TIME_FORMAT) {
    return moment(date).format(format);
}

export function formatToDate(date = null, format = DATE_FORMAT) {
    return moment(date).format(format);
}

export const dateUtil = moment;
