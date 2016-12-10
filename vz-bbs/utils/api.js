// var Promise = require("./bluebird.js")
import Promise from './es6-promise.min.js';
var util = require("./util.js")
var app = getApp()
/**
 * 获取发帖列表
 */
function myArticles(data) {
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/myarticles',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("获取我的发帖列表成功", result)
                    resolve(result)
                } else {
                    console.log("获取我的列表失败", result)
                }
            },
            fail: function (res) {
                console.log("获取我的列表失败", res)
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
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/userinfo',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("获取用户信息成功", result)
                    resolve(result)
                } else {
                    console.log("获取用户信息失败", result)
                    reject(res)
                }
            },
            fail: function () {
                console.log("获取用户信息失败", res)
                reject(res)
            },
            complete: function () {
                // complete
            }
        })
    })
}

/**
 * 获取头部信息
 */
function headInfo(data) {
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/getminisnsheadinfo',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
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
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/getartlistbyminisnsid',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
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
 * 评论帖子
 */
function commentartbyid(data) {
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/commentartbyid',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("评论帖子成功", result)
                    resolve(result)
                } else {
                    console.log("评论帖子失败", result)
                    reject(result)
                }
            },
            fail: function (result) {
                console.log("评论帖子失败", result)
                reject(result)
            }
        })
    })
}

/**
 * 回复帖子评论
 */
function replyartcommentbyid(data) {
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/replyartcommentbyid',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("回复帖子评论成功", data, result)
                    resolve(result)
                } else {
                    console.log("回复帖子评论失败", data, result)
                    reject(result)
                }
            },
            fail: function (result) {
                console.log("回复帖子评论失败", data, result)
                reject(result)
            }
        })
    })
}

/**
 * 帖子点赞
 */
function articlepraise(data) {
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/articlepraise',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("帖子点赞成功", result)
                    resolve(result)
                } else {
                    console.log("帖子点赞失败", result)
                    reject(result)
                }
            },
            fail: function (result) {
                console.log("帖子点赞失败", result)
                reject(result)
            }
        })
    })
}

/**
 * 发帖API
 */
function addArt(data) {
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/addart',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("发帖成功", result)
                    resolve(result)
                } else {
                    console.log("发帖失败", result)
                    reject(result)
                }
            },
            fail: function (result) {
                console.log("发帖失败", result)
                reject(result)
            }
        })
    })
}

/**
 * 获取我的积分列表
 */
function integralLog(data) {
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/integralLog',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("获取我的积分列表成功", result)
                    resolve(result)
                } else {
                    console.log("获取我的积分列表失败", result)
                    reject(result)
                }
            },
            fail: function (result) {
                console.log("获取我的积分列表失败", result)
                reject(result)
            }
        })
    })
}

/**
 * 获取我的积分兑换列表
 */
function integralexLog(data) {
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/integralexLog',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("获取我的积分兑换列表成功", result)
                    resolve(result)
                } else {
                    console.log("获取我的积分兑换列表失败", result)
                    reject(result)
                }
            },
            fail: function (result) {
                console.log("获取我的积分兑换列表失败", result)
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
            var result = JSON.parse(res.data)
            if (result.result) {

                console.log("获取帖子评论列表成功")
                success(res)
            }
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
    data["header"] = { "content-type": "application/x-www-form-urlencoded" }
    return that.wxApi(wx.request)(data)
        .then(function (res) {
            let result = JSON.res.data
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
    // "snsApi": snsApi,
    "getComment": getComment,
    headInfo,
    articles,
    commentartbyid,
    replyartcommentbyid,
    articlepraise,
    addArt,
    integralLog,
    integralexLog,   
}