// var Promise = require("./bluebird.js")
import Promise from './es6-promise.min.js';
var util = require("./util.js")
/**
 * 获取发帖列表
 */
function myarticles(data, filepath, cb) {
    wx.uploadFile({
        url: 'https://snsapi.vzan.com/minisnsapp/myarticles',
        filePath: filePath,
        name: 'file',
        // header: {}, // 设置请求的 header
        formData: data, // HTTP 请求中其他额外的 form data
        success: function (res) {
            let result = JSON.parse(res.data);
            if (result.result) {
                cb.success(result);
            }
        }
    })
}

/**
 * 搜索帖子
 */
function getartlistbykeyword(data, filepath, cb) {
    wx.uploadFile({
        url: 'https://snsapi.vzan.com/minisnsapp/getartlistbykeyword',
        filePath: filepath,
        name: 'file',
        // header: {}, // 设置请求的 header
        formData: data, // HTTP 请求中其他额外的 form data
        success: function (res) {
            let result = JSON.parse(res.data);
            if (result.result) {
                cb.success(result);
            }
        },
        fail: function (res) {
            console.log("搜索帖子失败", res)
        },
        complete: function () {
            cb.complete();
        }
    })
}


/**
 * 获取用户信息
 */
function userInfo(data, filepath, cb) {
    wx.uploadFile({
        url: 'https://snsapi.vzan.com/minisnsapp/userinfo',
        filePath: filepath,
        name: 'file',
        // header: {}, // 设置请求的 header
        formData: data, // HTTP 请求中其他额外的 form data
        success: function (res) {
            let result = JSON.parse(res.data)
            if (result.result == true) {
                console.log("获取用户信息成功", result)
                cb(result)
            } else {
                console.log("获取用户信息失败")
            }
        }
    })
}

/**
 * 获取帖子列表
 */
function getComment(id, data = {}, success, fail) {
    wx.request({
        url: "https://snsapi.vzan.com/minisnsapp/getcmt-" + id,
        data: data,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
            console.log("获取帖子评论列表成功")
            success(res)
        },
        fail: function (res) {
            console.log("获取帖子评论列表失败")
            fail(res)
        }
    })
}

/**
 * 上传图片
 */
function uplodaImg(data, filepath) {
    
    return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: 'https://snsapi.vzan.com/minisnsapp/uploadfilebytype',
          filePath: filepath,
          name:'file',
          // header: {}, // 设置请求的 header
          formData: data, // HTTP 请求中其他额外的 form data
          success: function (res) {
              let result = JSON.parse(res.data)
              if (result.result) {
                console.log("上传图片成功", result)
                resolve(result)
              } else{
                  reject(res)
              }
            },
            fail: function (res) {
                console.log("上传图片失败", res)
                reject(res)
            }
        })
    })
}


/**
 * 服务器API
 */
function snsApi(data, success, fail) {
    let that = this
    // data["header"] = {"content-type": "multipart/form-data;charset=gbk"}
    let d = data.formData
    d = util.json2FormData(d)
    console.log("输出", d)
    let rdata = { "url": data.url, "data": d, "method": "POST", "header": { "content-type": "application/x-www-form-urlencoded" } }
    return that.wxApi(wx.request)(rdata)
        .then(function (res) {
            let result = res.data
            console.log("请求成功", result)
            if (result.result == true) {
                return success(result) || true
            } else {
                console.log("服务器返回错误", res)
                return fail(result) || false
            }
        }, function (res) {
            console.log("请求失败", res)
            if (typeof fail == "function") {
                return fail(res) || false
            }
            return false;
        })
}


/**
 * 微信API
 */
function wxApi(wxFn) {
    return function (data = {}) {
        return new Promise((resolve, reject) => {
            data.success = function (res) { // 成功
                // console.log("执行 " + wxFn.toString() + " 成功", res)
                resolve(res)
            }
            data.fail = function (res) { // 失败
                // console.log("执行 " + wxFn.toString() + " 失败 ", res)
                reject(res)
            }
            wxFn(data)
        })
    }
}


module.exports = {
    "myarticles": myarticles,
    "getartlistbykeyword": getartlistbykeyword,
    "userInfo": userInfo,
    "wxApi": wxApi,
    "snsApi": snsApi,
    "getComment": getComment,
}