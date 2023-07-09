import { axios } from '@/utils/request'


/**
 * 获取成果编号
 * @returns 
 */

export function fetchAchieveNumber() {
    return axios.get('/fire/scienceAchieve/getNextNumber')
}

/**
 * 关联的科技项目集合
 * @returns 
 */

export function fetchRelationProject() {
    return axios.post('/fire/projectReport/queryProjectByYear')
}

/**
 * 通过id查询关联的科技项目
 * @returns 
 */
export function fetchProjectReportById(id) {
    return axios.get('/fire/projectReport/queryById', { params: { id } })
}

/**
 * 获取科技成果列表
 * @returns 
 */

export function fetchScienceAchieve(parameter) {
    return axios.get('/fire/scienceAchieve/list', { params: parameter })
}



/**
 * 添加科技成果
 * @returns 
 */

export function addScienceAchieve(data) {
    return axios.post('/fire/scienceAchieve/add', data)
}

/**
 * 编辑科技成果
 * @returns 
 */

export function editScienceAchieve(data) {
    return axios.post('/fire/scienceAchieve/edit', data)
}

/**
 * 根据ID获取科技成果
 * @returns 
 */

export function fetchScienceAchieveById(id) {
    return axios.get('/fire/scienceAchieve/queryById', { params: { id } })
}

/**
 * 删除科技成果
 * @returns 
 */

export function deleteScienceAchieve(id) {
    return axios.delete('/fire/scienceAchieve/delete', { params: { id } })
}


/**
 * 删除科技成果所有人信息
 * @returns 
 */

export function deleteResultUser(id) {
    return axios.delete('/fire/scienceAchieve/delete/resultUser', { params: { id } })
}

/**
 * 提交
 * @returns 
 */

export function submitScienceAchieve(id) {
    return axios.post('/fire/scienceAchieve/submitScienceAchieve', null, { params: { id } })
}

/**
 * 申请退回
 * @returns 
 */

export function applyBackScienceAchieve(id) {
    return axios.post('/fire/scienceAchieve/applyBackScienceAchieve', null, { params: { id } })
}

/**
 * 退回
 * @returns 
 */

export function backScienceAchieve(id) {
    return axios.post('/fire/scienceAchieve/backScienceAchieve', null, { params: { id } })
}

/**
 * 审核完成
 * @returns 
 */

export function auditCompleteScienceAchieve(id) {
    return axios.post('/fire/scienceAchieve/auditCompleteScienceAchieve', null, { params: { id } })
}

/**
 * 审核
 * @returns 
 */

export function auditScienceAchieve(parameter) {
    return axios.post('/fire/scienceAchieve/auditScienceAchieve', null, { params: parameter })
}


/**
 * 附件查询
 * @returns 
 */
export function fetchAttachment(parameter) {
    return axios.get('/fire/scienceAchieve/select/attachment/' + parameter)
}

/**
 * 根据手机号查询用户信息
 * @returns 
 */
export function fetchUserInfoByPhone(parameter) {
    return axios.get('/sys/user/_search/phone/', { params: parameter })
}



