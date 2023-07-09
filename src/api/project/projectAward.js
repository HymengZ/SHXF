import { axios } from '@/utils/request'

/**
 * 项目奖
 * @returns 
 */

/**
 * 获取奖项编号
 * @returns 
 */

export function fetchAwardProjectNumber() {
    return axios.get('/project/awardProject/getNextNumber')
}

/**
 * 关联的科技项目
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
 * 获取科技创新奖-项目奖列表
 * @returns 
 */

export function fetchAwardProject(parameter) {
    return axios.get('/project/awardProject/list', { params: parameter })
}



/**
 * 添加科技创新奖-项目奖
 * @returns 
 */

export function addAwardProject(data) {
    return axios.post('/project/awardProject/add', data)
}

/**
 * 编辑科技创新奖-项目奖
 * @returns 
 */

export function editAwardProject(data) {
    return axios.post('/project/awardProject/edit', data)
}

/**
 * 根据ID获取科技创新奖-项目奖
 * @returns 
 */

export function fetchAwardProjectById(id) {
    return axios.get('/project/awardProject/queryById', { params: { id } })
}




/**
 * 删除科技创新奖-项目奖
 * @returns 
 */

export function deleteAwardProject(id) {
    return axios.delete('/project/awardProject/delete', { params: { id } })
}
/**
 * 提交
 * @returns 
 */

export function submitAwardProject(id) {
    return axios.post('/project/awardProject/submitAwardProject', null, { params: { id } })
}

/**
 * 申请退回
 * @returns 
 */

export function applyBackAwardProject(id) {
    return axios.post('/project/awardProject/applyBackAwardProject', null, { params: { id } })
}

/**
 * 退回
 * @returns 
 */

export function backAwardProject(id) {
    return axios.post('/project/awardProject/backAwardProject', null, { params: { id } })
}

/**
 * 审核完成
 * @returns 
 */

export function auditAwardProjectComplete(id) {
    return axios.post('/project/awardProject/auditAwardProjectComplete', null, { params: { id } })
}

/**
 * 审核
 * @returns 
 */

export function auditAwardProject(parameter) {
    return axios.post('/project/awardProject/auditAwardProject', null, { params: parameter })
}

