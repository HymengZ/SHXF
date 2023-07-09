import { axios } from '@/utils/request'

/**
 *
 * @param {*} data 添加推广
 * @returns
 */
export function addAchieveExtension(data) {
  return axios.post('/fire/achieveExtension/add', data)
}

/**
 *
 * @param {*} id 编辑获取详情
 * @returns
 */
export function getAchieveExtensionDetail(id) {
  return axios.get('/fire/achieveExtensionDetail/queryByMainId', { params: { mainId: id } })
}

/**
 *
 * @param {*} id 获取主表详情
 * @returns
 */
export function getAchieveExtension(id) {
  return axios.get('/fire/achieveExtension/queryById', { params: { id: id } })
}

/**
 * 提交成果审核
 * @param {String} url 提交url
 * @param {{id: String}} parameter 成果ID
 * @returns
 */
export function submitAchieveExtension(url, parameter) {
  return axios({
    url: url,
    method: 'post',
    params: parameter
  })
}

/**
 * 成果申请退回
 * @param {String} url 请求地址
 * @param {{id: String}} parameter
 * @returns
 */
export function backAchieveExtension(url, parameter) {
  return axios({
    url: url,
    method: 'post',
    params: parameter
  })
}

/**
 * 成果搜索
 * @param {}
 * @returns
 */
export function searchAchieveExtension(url, parameter) {
  return axios({
    url: url,
    method: 'get',
    params: parameter,
  })
}

/**
 *
 * @param {*} dictCode
 * @returns
 */
export function dictItem(params) {
  return axios.get('/sys/dictItem/listByDictCode', { params })
}

/**
 * 修改编辑成果推广
 * @param {*} data
 * @returns
 */
export function EdtAchieveExtension(data) {
  return axios.put('/fire/achieveExtension/edit', data)
}

/**
 *  添加节点报告配置
 * @param {*} data
 */
export function addNoteReport(data) {
  return axios.post('/fire/noteReportConfig/add', data)
}

/**
 *  上传节点报告配置
 * @param {*} data
 */
export function uploadNoteReport(data) {
  return axios.post('/fire/achieveExtension/uploadNoteReport', data)
}

/**
 * 获取数据
 * @param {*} id
 * @returns
 */
export function getAchieve(id) {
  return axios.get('/api/fire/achieveExtensionDetail/queryByMainId', { params: { mainId: id } })
}

/**
 * 退回成果推广
 * @param {*} params
 * @returns
 */
export function backExtension(id) {
  return axios.post('/fire/achieveExtension/backExtension', {}, { params: { id } })
}

/**
 * 下架成果推广
 * @param {*} params
 * @returns
 */
export function unpublishAchieve(id) {
  return axios.post('/fire/achieveExtension/lowerShelfExtension', {}, { params: { id } })
}

/**
 * 发布成果推广
 * @param {*} params
 * @returns
 */
export function publishAchieve(id) {
  return axios.post('/fire/achieveExtension/publishExtension', {}, { params: { id } })
}

/**
 * 审核成果推广
 * @param {*} params
 * @returns
 */
export function applyAchieve(params) {
  return axios.post('/fire/achieveExtension/auditExtension', {}, { params })
}

/**
 * 获取成果推广编号
 * @param {*} params
 * @returns
 */
export function fetchExtensionNumber() {
  return axios.get('/fire/achieveExtension/getNextNumber', {})
}