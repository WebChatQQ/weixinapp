/**
 * Created by Stephen on 2016/12/16.
 *  事件处理
 */
var util = require("./util.js")
var constdata = require("./constdata.js")
var api = require("./api.js")

/**
 * 展示评论框
 * @param that 目标对象（this）
 * @param e 事件对象
 */
function showComment(that, e) {
    console.log("展示评论框")
    let artId = e.currentTarget.dataset.artId
    let commentId = e.currentTarget.dataset.commentId
    let commentName = e.currentTarget.dataset.commentName
    let toUserId = e.currentTarget.dataset.toUserId
    that.setData({
        "showComment": true,
        "comment": { "artId": artId, "commentId": commentId, "toUserId": toUserId, "commentName": commentName }
    })
    return true
}

/**
 * 关闭评论框
 * 清楚评论信息，评论图片信息，评论音频信息，录音信息
 * @param that
 * @param e
 */
function cancleComment(that) {
    console.log("关闭评论框")
    that.setData({ "showComment": false })
    that.setData({ "comment": null, "commentReImgs": null, "voice": null, "openRecordBox": 0, "recording": 0 })
    return true
}

/**
 * 展示表情框
 * @param that
 * @param e
 */
function showEmoijBox(that, e) {
    console.log("展示表情框")
    wx.showModal({ "title": "提示", "content": "暂不支持", "showCancel": false })
    return true
}

/**
 * 获取首页帖子列表
 * @param that
 * @param e
 * @param hotshow 是否热帖
 * @param categoryId 版块ID
 */
function getFirstPageArticles(that, hotshow = 0, categoryId = 0) {
    let verifyModel = util.primaryLoginArgs()
    let data = {
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        "fid": constdata.minisnsId, "hotshow": hotshow + "", "categoryId": categoryId + "", "pageIndex": 1 + ""
    }
    util.showLoading()
    that.setData({ "articles": [] })
    api.articles(data).then(
        function (success) {
            let articles = success.objArray || []
            articles = util.articleFilter(articles)
            that.setData({
                "articles": articles,
                "pageIndex": 1,
                "currentCategory": {
                    "id":categoryId,
                    "hot":hotshow
                },
                "scrollTop":0
            })
            util.endLoading()
            return true
        }, function (fail) {
            util.endLoading()
            return false
        })
}

/**
 * 选择图片并上传
 * @param that
 * @param e
 */
function uploadImg(that, e) {
    api.chooseImg().then(function (success) {
        let imgFiles = success.tempFilePaths || []
        let choosedImgs = that.data.choosedImgs || []
        util.showLoading("正在上传图片")
        let imgs = recurUploadImgs(imgFiles)
        util.endLoading()
        choosedImgs.concat(imgs)
        that.setData({ "choosedImgs": choosedImgs })
    }, function (fail) {
    })
}

/**
 * 删除选择的图片
 * @param that
 * @param e
 */
function removeImg(that, e) {
    let id = e.currentTarget.dataset.id
    let imgs = that.data.choosedImgs || []
    for (let i = 0; i < imgs.length; i++) {
        if (imgs[i].id == id) {
            imgs.splice(i, 1)
            break
        }
    }
    that.setData({ "choosedImgs": imgs })
}

/**
 * 提交评论
 * @param that
 * @param e
 */
function submitComment(that, e) {
    let content = e.detail.value.content
    let choosedImgs = that.data.choosedImgs
    let comment = that.data.comment
    let voice = that.data.voice
    let verifyModel = util.primaryLoginArgs()
    let getArtData = {
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        "fid": constdata.minisnsId, "artid": comment.artId + ""
    }
    let commentData = {
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        "artId": comment.artId + ""
    }
    let imgs = util.imgArrayToString(commentReImgs)
    if (!content && !choosedImgs) {
        wx.showModal({ "title": "提示", "content": "请输入内容或上传图片", "showCancel": false })
    }
    if (content) {
        commentData.comment = content
    }
    if (imgs) {
        commentData.images = imgs
    }
    if (voice && voice.id) {
        commentData.voiceId = voice.id
    }
    if (comment && comment.artId) {
        if (comment.commentId) { // 回复用户评论
            commentData.toUserId = comment.toUserId
            commentData.commentId = comment.commentId
            api.replyartcommentbyid(commentData).then(function (success) {
                cancleComment(that)
                return true
            }).then(function (args) {
                api.getarticle(getArtData).then(function (success) {
                    let articles = that.data.articles || []
                    for (let i = 0; i < articles.length; i++) {
                        if (articles[i] == comment.artId) {
                            articles.splice(i, 1, success.obj)
                            break
                        }
                    }
                    that.setData({ "articles": articles })
                })
            })

        } else {
            api.commentartbyid(commentData).then(function (success) {
                cancleComment(that)
                return true
            }).then(function (args) {
                api.getarticle(getArtData).then(function (success) {
                    let articles = that.data.articles || []
                    for (let i = 0; i < articles.length; i++) {
                        if (articles[i] == comment.artId) {
                            articles.splice(i, 1, success.obj)
                            break
                        }
                    }
                    that.setData({ "articles": articles })
                })
            })
        }
    }
}

/**
 * 帖子点赞
 * @param that
 * @param e
 */
function praiseArticle(that, e) {
    let verifyModel = util.primaryLoginArgs()
    let artId = e.currentTarget.dataset.artId
    api.articlepraise({
        "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp,
        "uid": verifyModel.uid, "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
        "artId": artId + ""
    }).then(function (success) {
        // 更新点赞状态
        let article = that.data.articles || []
        for (let i = 0; i < articles.length; i++) {
            if (articles[i].Id == artId) {
                articles[i].Praise += 1
                articles[i].IsPraise = true
            }
        }
        that.setData({ "articles": articles })
    })
}

/**
 * 赞赏
 * @param that
 * @param e
 
function rewardArticle(that, e) {
    let artId = e.currentTarget.dataset.artId
    let artId = e.currentTarget.dataset.artId
    console.log("赞赏" + artId)
    util.modelBox()
}
*/
/**
 * 获取下一页帖子
 * @param that
 * @param e
 */
function getNextPageArticles(that, e) {
    let verifyModel = util.primaryLoginArgs()
    let currentCategory = that.data.currentCategory
    let pageIndex = that.data.pageIndex + 1
    util.showLoading()

    api.articles({
        "deviceType": verifyModel.deviceType,
        "timestamp": verifyModel.timestamp,
        "uid": verifyModel.uid,
        "versionCode": verifyModel.versionCode,
        "sign": verifyModel.sign,
        "fid": constdata.minisnsId,
        "hotshow": currentCategory.hot + "",
        "categoryId": currentCategory.id + "",
        "pageIndex": pageIndex + ""
    }).then(function (success) {
        if (success.objArray.length > 0) {
            pageIndex = success.pageIndex
            let currentArticles = that.data.articles || []
            let articles = util.articleFilter((success.objArray || []))
            currentArticles = currentArticles.concat(articles)
            that.setData({ "articles": currentArticles, "pageIndex": success.pageIndex })
        }
        util.endLoading()
        wx.showToast({
            title: "没有更多数据了",
            icon: 'success',
            duration: 1000
        })
    }, function (fail) {
        util.endLoading();
    })
}

/**
 * 展示大图
 * @param that
 * @param e
 */
function previewImage(that, e) {
    let url = e.currentTarget.dataset.url
    if (url) {
        wx.previewImage({
            // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
            urls: [url],
            success: function (res) {
                console.log("展示大图成功", res)
            },
            fail: function (res) {
                console.log("展示大图失败", res)
            }
        })
    } else {
        console.log("显示大图的URL为", url)
    }
}

/**
 * 跳转搜索页面
 * @param that
 * @param e
 */
function searchArticles(that, e) {
    let keyWord = e.detail.value.keyWord
    if (!keyWord || keyWord == "") {
        return
    }
    wx.navigateTo({
        url: '/pages/search/search?keyWord=' + keyWord,
        success: function (res) {
            console.log("跳转到搜索页面成功", res)
            that.setData({ "showSearch": false })
        },
        fail: function (res) {
            console.log("跳转到搜索页面失败", res)
            that.setData({ "showSearch": false })
        }
    })
}

/********************************************************
 *  录音
 ********************************************************/
/**
 * 开启录音窗口
 */
function openRecordBox(that) {
    that.setData({ "openRecordBox": 1, "showComment": false })
}
/**
 * 开始录音
 * @param that
 */
function startRecord(that) {
    that.setData({ "recording": 1 })
    wx.startRecord({
        success: function (res) {
            console.log("录音结束", res)
            util.showLoading("正在上传语音")
            let verifyModel = util.primaryLoginArgs()
            let data = {
                "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp, "uid": verifyModel.uid,
                "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
                "uploadType": "audio", "fid": constdata.minisnsId
            }
            wx.uploadFile({
                url: 'https://snsapi.vzan.com/minisnsapp/uploadfilebytype',
                filePath: res.tempFilePath,
                name: 'file',
                formData: data, // HTTP 请求中其他额外的 form data
                success: function (res) {
                    let result = JSON.parse(res.data)
                    if (result.result) {
                        that.setData({ "voice": { "id": result.obj.id, "url": result.obj.url } })
                        console.log("上传录音成功", result, that.data)
                    } else {
                        console.log("上传录音失败", result, that.data)
                    }
                    util.endLoading()
                    that.setData({ "showComment": true, "openRecordBox": 0, "recording": 0 })
                },
                fail: function (res) {
                    console.log("上传录音失败", res)
                    that.setData({ hasRecorded: 1, recording: 0, recordTime: 0, })
                    that.setData({ "showComment": true, "voice": null, "openRecordBox": 0, "recording": 0 })
                    util.endLoading()
                }
            })
        }
    })
}

function stopRecord(that) {
    wx.stopRecord({
        success: function (res) {
            console.log("结束录音成功", res)
            that.setData({ recording: 0, hasRecorded: 1, formatedRecordTime: util.formatTime(that.data.recordTime) })
            that.setData({
                openRecordBox: 0,
                recording: 0,
                hasRecorded: 1,
                recordTime: 0,
                formatedRecordTime: "00:00:00"
            })
        },
        fail: function (res) {
            console.info("停止录音失败", res);

            that.setData({ recording: 0, hasRecorded: 1, formatedRecordTime: util.formatTime(that.data.recordTime) })
            that.setData({
                openRecordBox: 0,
                recording: 0,
                hasRecorded: 1,
                recordTime: 0,
                formatedRecordTime: "00:00:00"
            })
            // clearInterval(recordTimeInterval);
        }
    })
}

/**
 * 取消录音
 */
function cancleRecord(that) {
    wx.stopRecord({
        complete: function () {
            that.setData({ "showComment": true, "voice": null, "openRecordBox": 0, "recording": 0 })
        }
    })
}


/**
 * 递归上传图片
 * @param imgs
 * @param e
 */
function recurUploadImgs(imgs = []) {
    let verifyModel = util.primaryLoginArgs()
    let result = []
    let formData = {
        "deviceType": verifyModel.deviceType,
        "timestamp": verifyModel.timestamp,
        "uid": verifyModel.uid,
        "versionCode": verifyModel.versionCode,
        "sign": verifyModel.sign,
        "fid": constdata.minisnsId,
        "uploadType": "img"
    }
    if (imgs.length > 0) {
        let img = imgs.shift()
        api.uploadImg(img, formData)
            .then(function (success) {
                result.push({ "id": success.obj.id, "url": success.obj.url })
                if (imgs.length > 0) {
                    var r = recurUploadImgs(imgs);
                }
                if (r) {
                    result = result.concat(r)
                }
                return result
            }, function () {
                return result
            })
    }

}

module.exports = {
    showComment,
    cancleComment,
    showEmoijBox,
    getFirstPageArticles,
    uploadImg,
    removeImg,
    submitComment,
    praiseArticle,
    // rewardArticle,
    getNextPageArticles,
    previewImage,
    searchArticles,
    openRecordBox,
    startRecord,
    stopRecord,
    cancleRecord,
}


