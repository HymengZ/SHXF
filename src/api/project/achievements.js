import { axios } from '@/utils/request'

/**
 * 获取科技成果类别
 * @returns 
 */
export function fetchCategory() {
  return axios.get('/sys/dictItem/listByDictCode', { params: { dictCode: 'achieve_category' } })
}

/**
 * 获取证件类型
 * @returns 
 */
export function fetchCardType() {
  return axios.get('/sys/dictItem/listByDictCode', { params: { dictCode: 'cert_type' } })
}

/**
 * 获取科技成果
 * @param {*} params 
 * @returns 
 */
export function fetchScienceAchieve(params) {
  return axios.get('/fire/scienceAchieve/list', { params })
}
/**
 * 添加科技成果
 * @param {*} params 
 * @returns 
 */
export function addScienceAchieve(data) {
  return axios.post('/fire/scienceAchieve/add', data)
}

/**
 * 获取科技成果
 * @param {*} params 
 * @returns 
 */
export function getScienceAchieve(id) {
  return axios.get('/fire/scienceAchieve/queryById', { params: { id } })
}

/**
 * 提交科技成果
 * @param {*} params 
 * @returns 
 */
export function submitScienceAchieve(id) {
  return axios.post('/fire/scienceAchieve/submitScienceAchieve', {},{ params: { id } })
}

/**
 * 下架科技成果
 * @param {*} params 
 * @returns 
 */
export function unpublishScienceAchieve(id) {
  return axios.post('/fire/scienceAchieve/lowerShelfScienceAchieve', {},{ params: { id } })
}


/**
 * 发布科技成果
 * @param {*} params 
 * @returns 
 */
export function publishScienceAchieve(id) {
  return axios.post('/fire/scienceAchieve/publishScienceAchieve', {},{ params: { id } })
}


/**
 * 审核科技成果
 * @param {*} params 
 * @returns 
 */
export function applyScienceAchieve(params) {
  return axios.post('/fire/scienceAchieve/auditScienceAchieve',{}, {params})
}


/**
 * 退回科技成果
 * @param {*} params 
 * @returns 
 */
export function backScienceAchieve(id) {
  return axios.post('/fire/scienceAchieve/backScienceAchieve', {},{ params: { id } })
}


/**
 * 科技成果申请退回
 * @param {*} params 
 * @returns 
 */
export function applyBackScienceAchieve(id) {
  return axios.post('/fire/scienceAchieve/applyBackScienceAchieve', {}, { params: { id } })
}


/**
 * 获取科技成果
 * @param {*} params 
 * @returns 
 */
export function editScienceAchieve(data) {
  return axios.post('/fire/scienceAchieve/edit', data)
}

/**
 * 删除科技成果
 * @param {*} params 
 * @returns 
 */
export function deleteScienceAchieve(id) {
  return axios.delete('/fire/scienceAchieve/delete', { params: { id } })
}

/**
 * 获取项目报备
 * @param {*} params 
 * @returns 
 */
export function fetchProjectReport(params) {
  return axios.get('/fire/projectReport/list', { params })
}

/**
 * 获取项目报备
 * @param {*} params
 * @returns
 */
export function getProjectReport(id) {
  return axios.get('/fire/projectReport/queryById', { params: { id } })
}

/**
 * 根据证件获取用户信息
 * @param {{certType: String, certCode: String}}} params 
 * @returns 
 */
export function getUserByCert(params) {
  return axios.get('/sys/user/getUserByCert', { params })
}
