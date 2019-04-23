/**
 * 1.判断对象是否为空
 * 2.判断字符串是否有值
 * @param o {Object}
 * @return 不为空返回true 为空返回false
 */
export const isNotEmpty = o => {
  if (o === ""||o === undefined||o === null)
    return false

  if (typeof(o) == "String" && o.trim().length == 0) 
    return false
  
  return true
} 