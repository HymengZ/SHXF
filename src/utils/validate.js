/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
}

// a-form表单校验

// 验证手机号和固定电话
export function phoneCheck(rule, value, callbackFn) {
  const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  const regTwo = /^([0-9]{3,4}-)?[0-9]{7,8}$/
  if (value) {
    if (!reg.test(value) && !regTwo.test(value)) {
      callbackFn('请输入正确的手机号码或者固话号码')
      return
    }
  }
  callbackFn()
}
// 验证电子邮箱

export function emailCheck(rule, value, callbackFn) {
  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (value) {
    if (!reg.test(value)) {
      if (value) {
        callbackFn('请输入正确的邮箱')
      } else {
        callbackFn()
      }
      return
    }
  }
  callbackFn()
}

