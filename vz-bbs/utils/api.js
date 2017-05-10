// var Promise = require("./bluebird.js")
import Promise from './es6-promise.min.js';
var util = require("./util.js")
var constdata = require("./constdata.js")
var app = getApp()


/**************************************************************************************************************
 *  服务器API
 *
 ***************************************************************************************************************/
/**
 * 获取发帖列表
 */
function myArticles(data) {
    let d = util.json2String(data)
    console.log("获取发帖列表参数", d)
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
 */function getartlistbykeyword(data) {
    let d = util.json2String(data)
    console.log("搜索帖子参数", d)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/getartlistbykeyword',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("搜索帖子成功", result)
                    resolve(result)
                } else {
                    console.log("搜索帖子失败", result)
                    reject(result)
                }
            },
            fail: function (res) {
                console.log("搜索帖子失败", res)
                reject(res)
            }
        })
    })
}

/**
 * 登陆服务器
 */
function loginByWeiXin(data) {
    let d = util.json2String(data)
    console.log("登陆服务器参数", d)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/loginByWeiXin',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("登陆服务器成功", result)
                    resolve(res.data)
                } else {
                    console.log("登陆服务器失败", result)
                    reject(res.data)
                }
            },
            fail: function (res) {
                console.log("登陆服务器失败", res)
                reject(res)
            }
        })
    })
}

/**
 * 获取用户信息
 */
function user(data) {
    let d = util.json2String(data)
    console.log("获取用户信息参数", d)

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
    console.log("获取头部信息参数", d)

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
    console.log("获取帖子列表参数", d)
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
    console.log("评论帖子参数", d)
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
    console.log("回复帖子评论参数", d)
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
    console.log("帖子点赞参数", d)
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
    console.log("发帖API参数", d)
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
    console.log("获取我的积分列表参数", d)
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
    console.log("获取我的积分兑换列表参数", d)
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
 * 上传图片
 */
function uploadImg(filePath, data, fileName = "file") {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: 'https://snsapi.vzan.com/minisnsapp/uploadfilebytype',
            filePath: filePath,
            name: fileName,
            // header: {}, // 设置请求的 header
            formData: data, // HTTP 请求中其他额外的 form data
            success: function (res) {
                let result = JSON.parse(res.data)
                if (result.result) {
                    console.log("上传图片成功", data, filePath, result)
                    resolve(result)
                } else {
                    console.log("上传图片失败", data, filePath, result)
                    reject(result)
                }
            },
            fail: function (res) {
                console.log("上传图片失败", data, filePath, res)
                reject(res)
            }
        })
    })
}

/**
 * 获取帖子详情
 */
function getarticle(data) {
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/getarticle',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("获取单个帖子成功", d, result)
                    resolve(result)
                } else {
                    console.log("获取单个帖子失败", d, result)
                    reject(result)
                }
            },
            fail: function (res) {
                reject(res)
            }
        })
    })
}

/**
 * 获取帖子评论
 */
function getCommentList(data) {
    let d = util.json2String(data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/getcmt-' + data.id,
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" }, // 设置请求的 header
            success: function (res) {
                let result = res.data
                if (result != "") {
                    console.log("获取帖子评论信息成功", d, result)
                    resolve(result)

                } else {
                    console.log("获取帖子评论信息失败", d, result)
                    reject(result)
                }
            },
            fail: function (res) {
                reject(res)
            }
        })
    })
}

function checkPermissionByUser(params) {
    let d = util.json2String(params)
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://snsapi.vzan.com/minisnsapp/checkpermissionbyuser',
            data: d,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "content-type": "application/x-www-form-urlencoded" },
            success: function (res) {
                let result = res.data
                if (result.result) {
                    console.log("获取用户权限成功", result)
                    resolve(result);
                } else {
                    console.log("获取用户权限失败", result)
                    reject(result)
                }
            },
            fail: function (fail) {
                // fail
                console.log("获取用户权限失败", fail)
                reject(fail)
            }
        })
    });
}

/**
 * 操作帖子
 */
function operateArticle(operaIndex) {
    // TODO
    console.log("用户操作帖子"+constdata.permission[operaIndex])
    switch (operaIndex) {
        case 0 :
            // 置顶帖子：
            console.log("置顶帖子")
            break
        case 1 :
            console.log("删除帖子")
            break
        case 2 :
            console.log("禁言")
            break
        case 3 :
            console.log("拉黑")
            break
        case 4 :
            console.log("举报")
            break
    }
    console.log("用户操作帖子")
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


/**************************************************************************************************************
 *  微信API
 *
 ***************************************************************************************************************/
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
/**
 *    count: 1, // 最多可以选择的图片张数，默认9
 sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
 sourceType: ['album', 'camera'],
 */
function chooseImg(count = 1, sizeType = ['original'], sourceType = ['album', 'camera']) {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: count, // 最多可以选择的图片张数，默认9
            sizeType: sizeType, // original 原图，compressed 压缩图，默认二者都有
            sourceType: sourceType, // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                console.log("选择图片成功", res)
                resolve(res)
            },
            fail: function (res) {
                console.log("选择图片失败", res)
                reject(res)
            }
        })
    })
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
    loginByWeiXin,
    uploadImg,
    chooseImg,
    getarticle,
    getCommentList,
    checkPermissionByUser,
    operateArticle,
}