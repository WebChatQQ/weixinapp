// var Promise = require("./bluebird.js")
import Promise from './es6-promise.min.js';
var app = getApp()
/**
 * 获取发帖列表
 */
function myArticles(data) {
    let tmpFile = getApp().getTmpFile()
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: 'https://snsapi.vzan.com/minisnsapp/myarticles',
            filePath: tmpFile,
            name: 'file',
            // header: {}, // 设置请求的 header
            formData: { data }, // HTTP 请求中其他额外的 form data
            success: function (res) {
                let result = JSON.parse(res.data)
                if (result.result) {
                    console.log("获取我的发帖列表成功", res)
                    resolve(res)
                } else {
                    console.log("获取我的发帖列表失败", res)
                    reject(result)
                }
            },
            fail: function (res) {
                console.log("获取我的发帖列表失败", res)
            }
        })
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
function user(data) {
    let tmpFile = wx.getStorageSync('tmpFile')
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: 'https://snsapi.vzan.com/minisnsapp/userinfo',
            filePath: tmpFile,
            name: 'file',
            // header: {}, // 设置请求的 header
            formData: data, // HTTP 请求中其他额外的 form data
            success: function (res) {
                let result = JSON.parse(res.data)
                if (result.result) {
                    console.log("获取用户信息成功", result)
                    resolve(result)
                } else {
                    console.log("获取用户信息失败", result)
                    reject(res)
                }
            },
            fail: function (res) {
                console.log("获取用户信息失败", res)
                reject(res)
            }
        })
    })
}

/**
 * 获取头部信息
 */
function headInfo(data) {
    let tmpFile = wx.getStorageSync('tmpFile')
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: 'https://snsapi.vzan.com/minisnsapp/getminisnsheadinfo',
            filePath: tmpFile,
            name: 'file',
            // header: {}, // 设置请求的 header
            formData: data, // HTTP 请求中其他额外的 form data
            success: function (res) {
                let result = JSON.parse(res.data)
                if (result.result) {
                    console.log("获取头部信息成功", result)
                    resolve(result)
                } else {
                    console.log("获取头部信息失败", result)
                    reject(res)
                }
            },
            fail: function (res) {
                console.log("获取头部信息失败", res)
                reject(res)
            }
        })
    })
}

/**
 * 获取帖子列表
 */
function articles(data) {
    let tmpFile = wx.getStorageSync('tmpFile')
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: 'https://snsapi.vzan.com/minisnsapp/getartlistbyminisnsid',
            filePath: tmpFile,
            name: 'name',
            // header: {}, // 设置请求的 header
            formData: data, // HTTP 请求中其他额外的 form data
            success: function (res) {
                let result = JSON.parse(res.data)
                if (result.result) {
                    console.log("获取帖子列表成功", result)
                    resolve(result)
                } else {
                    console.log("获取帖子列表失败", result)
                    reject(result)
                }
            },
            fail: function (result) {
                console.log("获取帖子列表失败", result)
                reject(result)
            }
        })
    })
}

/**
 * 获取帖子评论列表
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
 * 服务器API
 */
function snsApi(data, success, fail) {
    let that = this
    data["header"] = { "content-type": "multipart/form-data;charset=gbk" }
    return that.wxApi(wx.uploadFile)(data)
        .then(function (res) {
            let result = JSON.parse(res.data)
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
    "myArticles": myArticles,
    "getartlistbykeyword": getartlistbykeyword,
    "user": user,
    "wxApi": wxApi,
    "snsApi": snsApi,
    "getComment": getComment,
    headInfo,
    articles,
}