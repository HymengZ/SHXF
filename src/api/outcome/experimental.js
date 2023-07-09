import { axios } from '@/utils/request'

/**
 * 修改编辑成果试点应用
 * @param {*} data
 * @returns
 */
export function EdtAchievePilot(data) {
  return axios.post('/fire/fireAchievePilot/edit', data)
}

/**
 * 编辑成果试点应用
 * @param {*} data
 * @returns
 */
export function EdAchievePilot(data) {
  return axios.post('/fire/fireAchievePilot/edit', data)
}

/**
 * 添加成果试点应用
 * @param {*} data
 * @returns
 */
export function addAchievePilot(data) {
  return axios.post('/fire/fireAchievePilot/add', data)
}

/**
 * 获取详情表信息
 * @param {*} id
 * @returns
 */
export function getAchievePilotDetail(id) {
  return axios.get('/fire/achievePilotDetail/queryByMainId', { params: { mainId: id } })
}


/**
 * 获取主表信息
 * @param {*} id
 * @returns
 */
 export function getAchievePilot(id) {
  return axios.get('/fire/fireAchievePilot/queryById', { params: { id: id } })
}

/**
 * 成果应用搜索
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
 * 提交成果应用
 * @param {String} url 提交url
 * @param {{id: String}} parameter 成果ID
 * @returns
 */
export function submitAchievePilot(url, parameter) {
  return axios({
    url: url,
    method: 'post',
    params: parameter
  })
}

/**
 * 成果应用申请退回
 * @param {String} url 请求地址
 * @param {{id: String}} parameter
 * @returns
 */
export function backAchievePilot(parameter) {
  return axios({
    url: '/fire/fireAchievePilot/applyBackPilot',
    method: 'post',
    params: parameter
  })
}

/**
 * 审核成果试点应用
 * @param {*} params
 * @returns
 */
export function applyAchieve(params) {
  return axios.post('/fire/fireAchievePilot/auditPilot', {}, { params })
}

/**
 * 发布成果试点应用
 * @param {*} params
 * @returns
 */
export function publishAchieve(params) {
  return axios.post('/fire/fireAchievePilot/publishPilot', {}, { params })
}

/**
 * 下架成果试点应用
 * @param {*} params
 * @returns
 */
export function unpublishAchieve(params) {
  return axios.post('/fire/fireAchievePilot/lowerShelfPilot', {}, { params })
}

/**
 * 退回成果推广
 * @param {*} params
 * @returns
 */
export function backExtension(id) {
  return axios.post('/fire/fireAchievePilot/backPilot', {}, { params: { id } })
}

/**
 * 修改编辑成果试点应用
 * @param {*} data
 * @returns
 */
export function EdtAchieveExtension(data) {
  return axios.post('/fire/fireAchievePilot/edit', data)
}

// /**
//  * 成果搜索
//  * @param {}
//  * @returns
//  */
//  export function searchAchieveExtension(url, parameter) {
//   return axios({
//     url: url,
//     method: 'get',
//     params: parameter,
//   })
