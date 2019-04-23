import {
  isNotEmpty
} from "@/utils/objectUtils";
// import { dicsQueryDics } from "@/api/getData";
// import store from "@/store/index.js";

/**
 * 将source和target共有属性，由source赋值至target
 * @param target {Object}
 * @param source {Object}
 * @param ignoreProperties {Array} 忽略的属性
 * @param isDeep {Boolean} 是否进行深层赋值
 */
export const mergeProperties = function (
  target,
  source,
  ignoreProperties,
  isDeep
) {
  if (!target || !source) return target;

  if (isDeep == null || isDeep == "undefined") isDeep = false;

  ignoreProperties = ignoreProperties || [];

  for (let i in target) {
    if (contains(ignoreProperties, i)) continue;

    if (i in source) {
      target[i] = source[i];
    } else if (typeof target[i] == "object" && isDeep) {
      mergeProperties(target[i], source, ignoreProperties, isDeep);
    }
  }
  return target;
};

/**
 * 将source属性及值复制至target
 * @param target {Object}
 * @param source {Object}
 * @param ignoreProperties {Array} 忽略的属性
 */
export const unionProperties = function (target, source, ignoreProperties) {
  if (!target || !source) return target;

  ignoreProperties = ignoreProperties || [];

  for (let i in source) {
    if (contains(ignoreProperties, i)) continue;

    target[i] = source[i];
  }

  return target;
};

/**
 * 判断数组是否包含指定元素
 * @param arr {Array}
 * @param obj {Object}
 */
export const contains = function (arr, obj) {
  let i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
};

/**
 * 获取字典及转码通用方法
 * @param arr {Array} 字典配置
 * @param obj {Object} 转码对象,可以是数组或对象
 */
export const fetchDics = async function (dicConfig, obj) {
  if (!isNotEmpty(dicConfig)) {
    return;
  }

  let dicIds = [];
  for (let i = 0; i < dicConfig.length; i++) {
    if (dicConfig[i].force) {
      dicIds.push(dicConfig[i].id);
    } else if (!store.state.dicMap.has(dicConfig[i].id)) {
      dicIds.push(dicConfig[i].id);
    }
  }

  let dics = await dicsQueryDics(dicIds);
  for (let i in dics) {

    store.commit("MAPDICDATA", dics[i]);
  }

  if (obj) {
    dicFormatter(dicConfig, obj);
  }

  return dics
};

/**
 * 获取单一字典方法
 * @param  dicId 字典ID
 * @param  force 是否强制刷新
 */
export const getDic = async function (dicId, force) {
  if (!store.state.dicMap.has(dicId)) {
    let o = {}
    o.id = dicId
    o.force = force
    await fetchDics([o])
  }
  return store.state.dicMap.get(dicId);
};


/**
 * 转码通用方法
 * @param arr {Array} 字典配置
 * @param obj {Object} 转码对象,可以是数组或对象
 * @param isReverse {Boolean} 是否反转,默认fale
 */
export const dicFormatter = function (dicConfig, obj, isReverse) {

  if (obj instanceof Array) {
    for (let i = 0; i < obj.length; i++) {
      objFormatter(obj[i]);
    }
  } else if (obj instanceof Object) {
    objFormatter(obj);
  }

  function objFormatter(o) {
    dicConfig.forEach(element => {
      if (o.hasOwnProperty(element.property)) {
        let items = store.state.dicMap.get(element.id) || [];
        items.forEach(function (value, key, mapObj) {
          if (isReverse) {
            if (o[element.property] == value.dicItemName) {
              o[element.property] = value.dicItemCode + "";
            }
          } else {
            if (o[element.property] == value.dicItemCode) {
              o[element.property] = value.dicItemName;
            }
          }
        });
      }
    });
  }
};

/**
 * 为get请求统一添加格式化语句
 * @param  data 
 */
export const formatQueryData = function (data) {
  let requestParams = '?';
  for (const key in data) {
    requestParams += `${key}=${data[key]}&`
  }
  requestParams = requestParams.slice(0, requestParams.lastIndexOf('&'))
  return requestParams;
};
