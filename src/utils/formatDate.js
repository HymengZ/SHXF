import moment from 'moment'


/**
 * 将日期格式化为YYYY-MM-DD HH:mm:ss
 * @param 
 */

export function formatSecond(val) {
    return moment(val).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 将日期格式化为YYYY-MM-DD HH:mm
 * @param 
 */

export function formatMinute(val) {
    return moment(val).format('YYYY-MM-DD HH:mm')
}

/**
 * 将日期格式化为YYYY年MM月
 * @param 
 */

export function formatMonth(val) {
    return moment(val).format('YYYY年MM月')
}

/**
 * 将日期格式化为YYYY年MM月DD日
 * @param 
 */

export function formatDay(val) {
    return moment(val).format('YYYY-MM-DD')
}

