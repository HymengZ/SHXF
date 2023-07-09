
import { axios } from '@/utils/request'

/**
 *
 * @param {*} params 
 * @returns
 */
export function upload(data) {
  return axios.post('/sys/common/upload', data)
}