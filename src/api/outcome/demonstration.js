import { axios } from '@/utils/request'

/**
 * 新增示范基地
 * @param {*} data 
 * @returns 
 */
export function addDemonstration(data) {
  return axios.post('/fire/achieveDemoBase/add', data)
}

/**
 * 查询示范基地
 * @param {*} params 
 * @returns 
 */
export function fetchDemonstration(params) {
  return axios.get('/fire/achieveDemoBase/list', { params })
}

/**
 * 查询单个示范基地
 * @param {*} params 
 * @returns 
 */
export function fetchDemonstrationDetail(params) {
  return axios.get('/fire/achieveDemoBase/queryById', { params })
}

/**
 * 提交示范基地
 * @param {*} params 
 * @returns 
 */
export function submitDemonstration(params) {
  return axios.post('/fire/achieveDemoBase/submitDemoBase', {}, { params })
}
/**
 * 审核示范基地
 * @param {*} params 
 * @returns 
 */
export function applyDemonstration(params) {
  return axios.post('/fire/achieveDemoBase/auditDemoBase', {}, { params })
}
/**
 * 发布示范基地
 * @param {*} params 
 * @returns 
 */
export function publishDemonstration(params) {
  return axios.post('/fire/achieveDemoBase/publishDemoBase', {}, { params })
}

/**
 * 下架示范基地
 * @param {*} params 
 * @returns 
 */
export function unpublishDemonstration(params) {
  return axios.post('/fire/achieveDemoBase/lowerShelfDemoBase', {}, { params })
}

/**
 * 删除示范基地
 * @param {*} params 
 * @returns 
 */
export function deleteDemonstration(params) {
  return axios.delete('/fire/achieveDemoBase/delete',{ params })
}

/**
 * 示范基地情况详情
 * @param {*} params 
 * @returns 
 */
export function fetchOneAchieveDemoSituation(params) {
  return axios.get('/fire/achieveDemoSituation/queryById',{ params })
}

/**
 * 申请退回示范基地
 * @param {*} params 
 * @returns 
 */
export function applyBackDemonstration(params) {
  return axios.post('/fire/achieveDemoBase/applyBackDemoBase', {}, { params })
}

/**
 * 退回示范基地
 * @param {*} params 
 * @returns 
 */
export function backDemonstration(params) {
  return axios.post('/fire/achieveDemoBase/backDemoBase', {}, { params })
}

/**
 * 修改单个示范基地
 * @param {*} data 
 * @returns 
 */
export function updateDemonstration(data) {
  return axios.post('/fire/achieveDemoBase/edit', data)
}


/**
 * 添加示范情况
 * @param {*} data 
 * @returns 
 */
export function addDemoSituation(data) {
  return axios.post('/fire/achieveDemoSituation/add', data)
}

/**
 * 获取示范情况
 * @param {{ baseId: String }} params 请求参数
 * @returns 
 */
export function fetchAchieveDemoSituation(params) {
  return axios.get('/fire/achieveDemoSituation/list', { params })
}

/**
 * 编辑示范情况
 * @param {{ baseId: String }} params 请求参数
 * @returns 
 */

export function updateAchieveDemoSituation(data) {
  return axios.post('/fire/achieveDemoSituation/edit', data)
}

/**
 * 批量删除示范情况
 * @param {{ baseId: String }} params 请求参数
 * @returns 
 */
export function deleteAchieveDemoSituation(params) {
  return axios.delete('/fire/achieveDemoSituation/deleteBatch', { params })
}