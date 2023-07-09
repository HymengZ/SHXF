import { axios } from '@/utils/request'

/**
 *
 * @param {*} params 获取年度目录
 * @returns
 */
export function fetchTreeData(params) {
  return axios.get('/fire/achieveCatalogueLevel/list', {params})
}

/**
 * 添加年度目录
 * @param {*} data
 * @returns
 */
export function addTreeData(data) {
  return axios.post('/fire/achieveCatalogueLevel/add', data)
}
/**
 * 修改年度目录
 * @param {*} data
 * @returns
 */
export function editTreeData(data) {
  return axios.post('/fire/achieveCatalogueLevel/edit', data)
}

/**
 * 删除年度目录
 * @param {*} id 目录id
 * @returns
 */
export function deleteTreeData(id) {
  return axios.delete('/fire/achieveCatalogueLevel/delete', { params: { id } })
}

/**
 * 获取文章列表
 * @param {*} params 请求参数
 * @returns
 */
export function fetchArticle(params) {
  return axios.get('/fire/achieveCatalogue/list', { params })
}

/**
 * 获取已发布文章列表
 * @param params
 * @returns
 */
export function listPublished(params) {
  return axios.get('/fire/achieveCatalogue/listPublished', { params })
}

/**
 * 添加目录文章
 * @param {*} data
 * @returns
 */
export function addArticle(data) {
  return axios.post('/fire/achieveCatalogue/add', data)
}

/**
 * 修改目录文章
 * @param {*} data
 * @returns
 */
export function updateArticle(data) {
  return axios.post('/fire/achieveCatalogue/edit', data)
}

// /**
//  * 修改年度目录
//  * @param {*} data
//  * @returns
//  */
//  export function editLogData(data) {
//     return axios.post('fire/achieveCatalogue/edit', data)
// }

/**
 * 下架文章
 * @param {*} id 文章id
 * @returns
 */
export function unpublishArticle(id) {
  return axios.delete('/fire/achieveCatalogue/lowerShelf', { params: { id } })
}

/**
 * 删除文章
 * @param {*} id 文章id
 * @returns
 */
export function deleteArticle(id) {
  return axios.delete('/fire/achieveCatalogue/delete', { params: { id } })
}
