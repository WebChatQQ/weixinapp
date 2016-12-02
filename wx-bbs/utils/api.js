// var Promise = require("./bluebird.js")
import Promise from './es6-promise.min.js';
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
      name:'file',
      // header: {}, // 设置请求的 header
      formData: data, // HTTP 请求中其他额外的 form data
      success: function(res){
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
 * 
 */
function snsApi(data, success, fail) {
    let that = this
    return that.wxApi(wx.uploadFile)(data)
    .then(function(res){
        let result = JSON.parse(res.data)
        console.log("请求成功", result)
        if (result.result == true) {
            return success(result) || true
        } else {
            console.log("服务器返回错误", res)
            return fail(result) || false
        }
    }, function(res) {
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
    return function(data = {}) {
        return new Promise((resolve, reject) => {
            data.success = function(res) { // 成功
                // console.log("执行 " + wxFn.toString() + " 成功", res)
                resolve(res)
            }
            data.fail = function(res) { // 失败
                // console.log("执行 " + wxFn.toString() + " 失败 ", res)
                reject(res)
            }
            wxFn(data)
        })
    }
}


module.exports = {
    "myarticles": myarticles,
    "getartlistbykeyword":getartlistbykeyword,
    "userInfo":userInfo,
    "wxApi":wxApi,
    "snsApi":snsApi,
}