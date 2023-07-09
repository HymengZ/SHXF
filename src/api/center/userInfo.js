import { axios } from '@/utils/request'


/**
 * 获取用户信息
 * @returns 
 */

export function fetchUserInfo() {
    return axios.get('/sys/user/getUserInfo')
}

/**
 * 编辑用户信息
 * @returns 
 */

export function updateUserInfo(data) {
    return axios.post('/sys/update/user', data)
}

/**
 * 编辑用户单位-外部
 * @returns 
 */
export function editUnit(data) {
    return axios.post('/sys/user/unit/edit', data)
}

/**
 * 修改密码
 * @returns 
 */
export function changePassword(data) {
    return axios.put('/sys/common/changePassword', data)
}


/**
 * 修改手机号/账号
 * @returns 
 */
export function updateMobile(data) {
    return axios.put('/sys/user/updateMobile', data)
}

/**
 * 添加邀请函
 * @returns 
 */
export function addLetter(data) {
    return axios.post('/invitation/letter/add', data)
}


/**
 * 编辑邀请函
 * @returns 
 */
export function editLetter(data) {
    return axios.put('/invitation/letter/edit', data)
}


/**
 * 邀请函统计
 * @returns 
 */
export function getInviteCount() {
    return axios.get('/invitation/letter/getInviteCount')
}

/**
 * 邀请函列表
 * @returns 
 */
export function getInviteList(parameter) {
    return axios.get('/invitation/letter/list', { params: parameter })
}


/**
 * 队伍-处室管理列表查询
 * @returns 
 */
export function getRanksList(parameter) {
    return axios.get('/sys/item/list', { params: parameter })
}


/**
 * 归属审核
 * @returns 
 */
export function auditAccount(data) {
    return axios.post('/sys/item/audit', data)
}

/**
 * 停号/恢复
 * @returns 
 */
export function operaAccount(data) {
    return axios.post('/sys/item/opera/account', data)
}

/**
 * 换队
 * @returns 
 */
export function switchRanks(data) {
    return axios.post('/sys/item/switch/item', data)
}

/**
 * 用户单位-获取单位层级树
 * @returns 
 */
export function getUnitTree(parameter) {
    return axios.get('/sys/common/_search/tree', { params: parameter })
}
