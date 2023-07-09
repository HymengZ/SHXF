import { axios } from '@/utils/request'

// 获取数据字典的内容
export function listByDictCode(parameter) {
    return axios.get('/sys/dictItem/listByDictCode', { params: { dictCode: parameter } })
}