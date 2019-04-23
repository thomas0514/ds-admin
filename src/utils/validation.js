import {
  isNotEmpty
} from "@/utils/objectUtils";
import {
  Message
} from "element-ui";
import {
  contains
} from "@/utils/tool"

/* 校验入参:
   rules: {productLiabName: [
       { required: true, min: 4, max: 40,  validator: validate, trigger: 'blur', regax: [{ message: '请输入中文、英文、数字', ruleFormat: '/^[a-z0-9\u4e00-\u9fa5]+$/i' }]
     }]}
     min,max为输入范围, 非必要入参
     regax为自定义规则
*/
let validateRules = {
  //邮箱
  email: {
    regax: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
    message: "请输入正确的邮箱"
  },
  //手机号
  phone: {
    regax: /^1[34578]\d{9}$/,
    message: "请输入正确的手机号"
  },
  //中文校验
  zh: {
    regax: /^[\u4e00-\u9fa5]+$/,
    message: "请输入中文"
  },
  //中文和字母校验
  zhEn: {
    regax: /^[a-zA-Z\u4e00-\u9fa5]+$/,
    message: "请输入中文和字母"
  },
  //英文和数字校验
  enNum: {
    regax: /^[a-zA-Z0-9]+$/i,
    message: "请输入英文和数字"
  },
  //中文和数字校验
  zhNum: {
    regax: /^[0-9\u4e00-\u9fa5]+$/i,
    message: "请输入中文和数字"
  },
  //数字校验
  number: {
    regax: /^\d+$/,
    message: "请输入数字"
  },
  //最多带两位小数的正数
  money: {
    regax: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/,
    message: "请输入最多包含2位小数的数字"
  },
  //中文数字英文
  zhEnNum: {
    regax: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/i,
    message: "请输入中文、数字和英文"
  }
}

/**
 * 通用校验方法
 * @param rules {Object}
 * @param value {Object}
 * @param callback {Object}
 */
export const validate = function (rules, value, callback) {
  if (!isNotEmpty(rules)) {
    return
  }
  let msg = ""
  //校验是否为空
  if (!rules.part) {
    //part为自定义字段,用来检测非必填项的验证规则,不传为false,如果要用就传true
    if (!isNotEmpty(value)) {
      msg = "该项不能为空"
      callback(new Error(msg))
    }
  }

  //校验长度
  if (rules['min'] > value.length || value.length > rules['max']) {
    msg = "请输入" + rules['min'] + "-" + rules['max'] + "位"
    callback(new Error(msg))
  }
  //校验通用规则
  for (let item in rules) {
    if (item in validateRules) {
      if (!validateRules[item].regax.test(value)) {
        msg = validateRules[item].message
        callback(new Error(msg))
      }
    } else {
      callback();
    }
  }
  //校验自定义规则
  if (rules['regax']) {
    if (rules['regax'].length > 0) {
      for (let i = 0; i < rules['regax'].length; i++) {
        let rule = rules['regax'][i]
        let reg = eval(rule.ruleFormat);
        //part为true,用来检测非必填项的验证规则
        if (rules.part) {
          if (value != "") {
            if (!reg.test(value)) {
              msg = rule.message
              callback(new Error(msg))
            }
          }
        } else {
          if (!reg.test(value)) {
            msg = rule.message
            callback(new Error(msg))
          }
        }
      }
    }
  }

  if (!isNotEmpty(msg)) {
    return
  }
}

/**
 * 全部表单校验方法
 * @param rules {Object}
 * @param value {Object}
 * @param labelName {Object}
 */
export const formValidate = function (rules, value, labelName) {
  if (!isNotEmpty(rules)) {
    return false
  }
  let msg = ""
  //校验是否为空
  if (!rules.part) {
    if (!isNotEmpty(value)) {
      msg = labelName + "不能为空"
      Message.error(msg)
      return false
    }
  }

  //校验长度

  if (rules['min'] > value.length || value.length > rules['max']) {
    msg = "请输入" + rules['min'] + "-" + rules['max'] + "位"
    Message.error(msg)
    return false
  }


  //校验通用规则
  for (let item in rules) {
    if (item in validateRules) {
      if (!validateRules[item].regax.test(value)) {
        msg = validateRules[item].message
        Message.error(msg)
        return false
      }
    }
  }
  //校验自定义规则
  if (rules['regax']) {
    if (rules['regax'].length > 0) {
      for (let i = 0; i < rules['regax'].length; i++) {
        let rule = rules['regax'][i]
        let reg = eval(rule.ruleFormat);
        //part为true,用来检测非必填项的验证规则
        if (rules.part) {
          if (value != "") {
            if (!reg.test(value)) {
              msg = rule.message
              Message.error(msg)
              return false
            }
          }
        } else {
          if (!reg.test(value)) {
            msg = rule.message
            Message.error(msg)
            return false
          }
        }
      }
    }
  }
  return true
}

/**
 * 全部表单校验方法
 * @param formObjs {Object}
 */
export const validateAlls = function (formObjs) {
  let flag = true
  let form = formObjs.model
  let rules = formObjs.rules
  let labels = formObjs.fields

  // 更改遍历顺序依据
  for (let i in labels) {
    let prop = labels[i].prop
    let label = labels[i].label
    if (rules.hasOwnProperty(prop)) {
      for (let j in form) {
        if (j === prop) {
          flag = formValidate(rules[prop][0], form[prop], label)
          if (!flag) {
            return flag
          }
        }
      }
    }
  }
  // for (let i in form) {
  //   if (rules.hasOwnProperty(i)) {
  //     for (let j in labels) {
  //       if (i === labels[j].prop) {
  //         flag = formValidate(rules[i][0], form[i], labels[j].label)
  //         if (!flag) {
  //           return flag
  //         }
  //       }
  //     }
  //   }
  // }
  return flag
}

/**
 * 全部表单校验方法
 * @param formObjs {Object}
 */
export const validateAllsWithExcept = function (formObjs, exceptList) {
  let flag = true
  let form = formObjs.model
  let rules = formObjs.rules
  let labels = formObjs.fields

  for (let i in form) {
    if (rules.hasOwnProperty(i)) {
      for (let j in labels) {
        if (i === labels[j].prop) {
          if (contains(exceptList, i)) { // 跳过验证
            flag = true
          } else {
            flag = formValidate(rules[i][0], form[i], labels[j].label)
          }
          if (!flag) {
            return flag
          }
        }
      }
    }
  }
  return flag
}
