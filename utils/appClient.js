import config from './config'
/*
    调用无线网关接口
    url格式与mapi不同 
    api.dangdang.com/[module]/[action]?ct=[mina]&cv=[]&ts=[]&tc=[]&udid=[]&[业务所需参数]
      * action    controller/action
      * method   请求类型GET/POST
      * params   业务参数（不包含 user_client 等通用参数）
      * domain   网关域名
      * success  成功回调
    返回格式
    errorCode:[module名字][错误码]
    errorMsg:[错误提示]
    result:[结果]

    比如：
    errorCode:navi94
    errorMsg:’非法操作，访问失败’
    result:[接口结果]

    或者：
    errorCode:0
    errorMsg:’成功’
    result:[接口结果]
*/
function callMinaAPI(args) {
  if (!(args.domain && args.domain != '')) {
    throw Error("domain 不能为空")
  }
  let moduleName = args.moduleName ? args.moduleName : '' // 网关调用不同系统module
  let url = args.domain + moduleName;
  let method = args.method && args.method != '' ? args.method.toUpperCase() : 'GET'
  // request方法传参
  let requestData = {
    url,
    method,
    params: args.params,
    success: args.success,
    fail: args.fail,
    complete: args.complete,
  }
  request(requestData)
}

function request(requestData) {
  console.log(requestData);
  let url = requestData.url
  if (requestData.method === 'GET' && requestData.params) {
    let params = typeof requestData.params === 'string' ? requestData.params : buildQueryString(requestData.params)
    if (url.indexOf('?') >= 0) {
      url += '&' + params
    } else {
      url += '?' + params
    }
  }
  wx.request({
    url,
    method: requestData.method,
    data: requestData.params,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    dataType: 'json',
    success: res => {
      if (res.statusCode == 200) {
        requestData.success && requestData.success(res.data)
      } else {
        requestData.success && requestData.success({
          errorCode: '-1',
          errorMsg: '接口调用出错。statusCode: ' + res.statusCode + ' errMsg: ' + res.errMsg,
        })
      }
    },
    fail: requestData.fail,
    complete: requestData.complete,
  })
}


function getTimecodeMina(controller, action, udid, timestamp) {
  return md5([controller, action, udid, timestamp, config.MAPI_ENCODE_STR].join(''))
}

function buildQueryString(obj, num_prefix, temp_key) {
  let output_string = []
  Object.keys(obj).forEach(k => {
    let key = ''
    if (num_prefix && !isNaN(k)) {
      key = num_prefix + k
    } else {
      key = k
    }
    key = encodeURIComponent(key.replace(/[!'()*]/g, escape))
    if (temp_key) {
      key = temp_key + '[' + key + ']'
    }
    if (typeof obj[k] === 'object') {
      output_string.push(buildQueryString(obj[k], null, key))
    } else {
      output_string.push(key + '=' + encodeURIComponent(obj[k] + ''))
    }
  })
  return output_string.join('&')
}
export default { callMinaAPI }
