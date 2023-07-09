import { axios } from '@/utils/request'

/**
 * 科技资源-获取编号
 * @returns 
 */
export function fetchResourceNumber() {
    return axios.get('/fire/science/resource/getNextNumber')
}

/**
 * 科技资源-添加/编辑
 * @returns 
 */
export function saveResource(data) {
    return axios.post('/fire/science/resource/save', data)
}


/**
 * 科技资源-列表查询
 * @returns 
 */
export function fetchResourceList(parameter) {
    return axios.get('/fire/science/resource/list', { params: parameter })
}

/**
 * 科技资源-根据id查询
 * @returns 
 */
export function fetchResourceById(id) {
    return axios.get('/fire/science/resource/detail', { params: { id } })
}

/**
 * 删除科技资源
 * @returns 
 */

export function deleteResource(id) {
    return axios.delete('/fire/science/resource/delete', { params: { id } })
}


/**
 * 通过id删除科技资源文件
 * @returns 
 */

export function deleteResourceFile(ids) {
    return axios.delete('/fire/science/resource/delete/file', { params: { ids } })
}

/**
 * 科技资源操作
 * @returns 
 */

export function handleResource(data) {
    return axios.post('/fire/science/resource/handle', data)
}

/**
 * 已参与孵化列表
 * @returns 
 */

export function fetchQueryMatch(parameter) {
    return axios.get('/fire/science/resource/queryMatch/result', { params: parameter })
}


/**
 * 添加联系我们
 * @returns 
 */

export function addContactUs(parameter) {
    return axios.post('/fire/science/request/save', { params: parameter })
}

// 用户是否发布

export function fetchPublishStatus(userId) {
    return axios.get('/fire/science/resource/exist/_by', { params: { userId } })
}